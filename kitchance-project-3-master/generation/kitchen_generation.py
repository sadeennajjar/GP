import os
import sys
import time
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# Set path to access backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from database import save_transcript, initialize_db
from init_db import initialize_db
from generation_prompt import gpt4_turbo_rewrite, detect_styles_and_rules
from run_direct_generation import run_kitchen_generation  # Your SDXL pipeline function

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize database
initialize_db()

@app.route('/transcript', methods=['POST'])
def receive_transcript():
    try:
        data = request.json
        print("\n🚨 /transcript endpoint hit")
        print("📨 Full payload:", data)

        # === Step 1: Extract transcript
        transcript_text = data.get("transcript", "")
        if not transcript_text:
            tool_calls = data.get("message", {}).get("toolCalls", [])
            for call in tool_calls:
                if call.get("function", {}).get("name") == "SendTranscriptToKitChance":
                    args = call["function"].get("arguments", {})
                    if isinstance(args, str):
                        args = json.loads(args)
                    transcript_text = args.get("transcript", "")
                    break

        if not transcript_text:
            return jsonify({"error": "Transcript not found"}), 400

        print("📝 Extracted transcript:", transcript_text)

        # === Step 2: Summarize transcript
        summary = gpt4_turbo_rewrite(transcript_text)
        print("🧠 Summary:", summary)

        # === Step 3: Generate design rules
        window_positions = []
        rules = detect_styles_and_rules(summary, window_positions)

        prompt = f"""
### Customer Preferences (Extracted Summary):
{summary}

### Detected Features:
No windows detected.

### Design Guidelines:
{chr(10).join('- ' + r for r in rules)}

### Notes:
Strictly respect the existing structure of the room based on the provided image. No structural changes such as moving or adding windows, doors, or walls are allowed.
"""

        print("📋 Final Prompt:\n", prompt)

        # === Step 4: Get image path
        image_path = data.get("image_path", "")
        if not os.path.exists(image_path):
            return jsonify({"error": f"Image not found: {image_path}"}), 400

        # === Step 5: Run SDXL generation
        generated_path = run_kitchen_generation(transcript_text, image_path)

        if not os.path.exists(generated_path):
            return jsonify({"error": "Generation failed"}), 500

        # === Step 6: Return result
        relative_url = f"/outputs/{os.path.basename(os.path.dirname(generated_path))}/{os.path.basename(generated_path)}"

        return jsonify({
            "status": "success",
            "summary": summary,
            "prompt": prompt,
            "image_url": relative_url
        })

    except Exception as e:
        print("❌ Error in /transcript:", e)
        return jsonify({"error": str(e)}), 500

# === Serve generated output images
@app.route('/outputs/<path:filename>')
def serve_output(filename):
    return send_from_directory("outputs", filename)

if __name__ == '__main__':
    app.run(port=4000)
