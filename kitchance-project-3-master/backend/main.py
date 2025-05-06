import webbrowser
import os
import datetime
import subprocess
import sqlite3
import bcrypt
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import save_transcript, initialize_db
from init_db import initialize_db

app = Flask(__name__)
CORS(app)  # Allow frontend access

# Initialize DB and tables
initialize_db()

# === Auth Routes ===

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password").encode("utf-8")

    conn = sqlite3.connect("kitchance_transcripts.db")
    c = conn.cursor()

    # Check for duplicate
    c.execute("SELECT * FROM users WHERE email = ?", (email,))
    if c.fetchone():
        return jsonify({"success": False, "message": "Email already exists"}), 400

    # Hash password and insert
    hashed_pw = bcrypt.hashpw(password, bcrypt.gensalt())
    c.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, hashed_pw))
    conn.commit()
    conn.close()

    return jsonify({"success": True})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password").encode("utf-8")

    conn = sqlite3.connect("kitchance_transcripts.db")
    c = conn.cursor()
    c.execute("SELECT password FROM users WHERE email = ?", (email,))
    row = c.fetchone()
    conn.close()

    if row and bcrypt.checkpw(password, row[0]):
        return jsonify({"success": True})
    return jsonify({"success": False, "message": "Invalid email or password"}), 401

# === Transcript Routes ===

def get_latest_transcript():
    try:
        conn = sqlite3.connect('kitchance_transcripts.db')
        cursor = conn.cursor()
        cursor.execute('''
            SELECT transcript FROM transcripts 
            ORDER BY timestamp DESC 
            LIMIT 1
        ''')
        result = cursor.fetchone()
        conn.close()
        return result[0] if result else None
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return None

@app.route('/latest-transcript', methods=['GET'])
def latest_transcript():
    transcript = get_latest_transcript()
    if transcript:
        return jsonify({"transcript": transcript})
    return jsonify({"error": "No transcript found"}), 404

@app.route('/')
def home():
    return "KitChance Transcript Webhook is live!"

@app.route('/transcript', methods=['POST'])
def receive_transcript():
    try:
        data = request.json
        print("# Full data received from VAPI:", data)

        if not data:
            return jsonify({"error": "No JSON data received"}), 400

        # Extract transcript
        transcript_text = None

        if 'transcript' in data:
            transcript_text = data['transcript']
        else:
            message_data = data.get('message', {})
            tool_calls = message_data.get('toolCalls', [])
            for call in tool_calls:
                if call.get('function', {}).get('name') == 'SendTranscriptToKitChance':
                    try:
                        args = call['function']['arguments']
                        if isinstance(args, str):
                            import json
                            args = json.loads(args)
                        transcript_text = args.get('transcript', '')
                        break
                    except Exception as e:
                        print(f"Error parsing arguments: {e}")

        if not transcript_text:
            return jsonify({"error": "No transcript found in the data"}), 400

        # Extract user preferences
        import re
        user_name = re.search(r"name is ([^\.]+)", transcript_text)
        user_name = user_name.group(1) if user_name else None

        kitchen_style = re.search(r"(modern|rustic|cozy|traditional) kitchen", transcript_text, re.I)
        kitchen_style = kitchen_style.group(1) if kitchen_style else None

        materials = re.search(r"with ([^,\.]+)", transcript_text)
        materials = materials.group(1) if materials else None

        usage = re.search(r"made for ([^,\.]+)", transcript_text)
        usage = usage.group(1) if usage else None

        layout = re.search(r"(island|open space|L-shaped|U-shaped)", transcript_text, re.I)
        layout = layout.group(1) if layout else None

        appliances = re.search(r"(coffee bar|double oven|big fridge)", transcript_text, re.I)
        appliances = appliances.group(1) if appliances else None

        # Save to DB
        save_transcript(user_name, kitchen_style, materials, usage, layout, appliances, transcript_text)

        # Save to file
        with open("latest_transcript.txt", "w", encoding="utf-8") as f:
            f.write(transcript_text)

        # Trigger kitchen generation
        print("🚀 Generating kitchen using latest transcript...")
        result = subprocess.run(["python", "generation/kitchen_generation.py"], capture_output=True, text=True)
        print("📃 STDOUT:\n", result.stdout)
        print("🐞 STDERR:\n", result.stderr)

        # Auto open generated image
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        filename = f"generated_kitchen_{timestamp}.jpg"
        image_path = os.path.abspath(filename)
        webbrowser.open(f"file://{image_path}")
        print(f"🖼️ Image opened: {image_path}")

        return jsonify({
            "status": "received",
            "extracted_data": {
                "user_name": user_name,
                "kitchen_style": kitchen_style,
                "materials": materials,
                "usage": usage,
                "layout": layout,
                "appliances": appliances
            }
        }), 200

    except Exception as e:
        print(f"Error processing transcript: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(port=4000)
