import requests
import base64
import time
import json
import datetime
import os
import pathlib
import webbrowser
from openai import OpenAI
from sentence_transformers import SentenceTransformer, util

# === CONFIG ===
IMAGE_PATH = r"C:\Users\najja\Downloads\R.webp"
TRANSCRIPT_PATH = "latest_transcript.txt"
ROOMGPT_API_TOKEN = "r8_5Xo3Jz4U92OfKV81vjdb41vSO5LMsYD1NNwaL"
ROOMGPT_API_URL = "https://api.replicate.com/v1/predictions"
ROOMGPT_MODEL_VERSION = "795433b19458d0f4fa172a7ccf93178d2adb1cb8ab2ad6c8fdc33fdbcd49f477"
OPENROUTER_API_KEY = "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"

# === STEP 1: LOAD TRANSCRIPT ===
try:
    with open(TRANSCRIPT_PATH, "r") as f:
        transcript = f.read().strip()
        print("Loaded transcript:", transcript)
except:
    transcript = ""
    print("Warning: Could not read transcript file.")

# === STEP 2: GPT-4 Turbo Rewriting ===
def gpt4_turbo_rewrite(text):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "mistralai/mistral-7b-instruct",
        "messages": [
            {
                "role": "system",
                "content": "You are an interior design assistant. Rewrite the user's kitchen preferences into a highly descriptive and elegant one-paragraph summary for prompt generation."
            },
            {
                "role": "user",
                "content": text
            }
        ]
    }

    res = requests.post(url, headers=headers, json=payload)
    res_json = res.json()
    try:
        return res_json["choices"][0]["message"]["content"].strip()
    except:
        raise ValueError(f"GPT API Error: {res_json.get('error', res_json)}")

summary = gpt4_turbo_rewrite(transcript)
print("Summarized Transcript:", summary)

# === STEP 3: RULE ENGINE ===
def detect_styles_and_rules(summary, window_positions):
    embedder = SentenceTransformer('all-MiniLM-L6-v2')

    design_styles = {
        "modern": "modern design with clean lines, minimal clutter, and contemporary aesthetics",
        "eco-friendly": "sustainable and eco-friendly materials",
        "rustic": "farmhouse elements like reclaimed wood and warm tones",
        "minimalist": "simplicity, decluttered spaces, and monochrome palettes",
        "industrial": "concrete, exposed beams, and metal accents",
        "luxury": "marble, gold, and high-end appliances",
        "scandinavian": "light colors, natural wood, cozy textures",
        "bohemian": "vibrant colors, layered textiles, eclectic patterns",
        "traditional": "classic furniture and symmetrical layouts",
        "coastal": "breezy tones, nautical elements",
        "mid-century modern": "retro furniture, geometric shapes",
        "transitional": "blend of traditional and modern",
        "art deco": "bold patterns, metallic finishes, glamorous vibes"
    }

    moods = {
        "airy": "open with breathing room",
        "cozy": "warm and inviting",
        "formal": "structured and upscale",
        "casual": "laid-back and informal"
    }

    personas = {
        "family": "kid-friendly functionality",
        "chef": "professional-grade appliances and workflow",
        "entertainer": "open areas and serving spaces"
    }

    summary_embedding = embedder.encode(summary, convert_to_tensor=True)
    style_embeddings = {k: embedder.encode(v, convert_to_tensor=True) for k, v in design_styles.items()}
    mood_embeddings = {k: embedder.encode(v, convert_to_tensor=True) for k, v in moods.items()}
    persona_embeddings = {k: embedder.encode(v, convert_to_tensor=True) for k, v in personas.items()}

    similarities = [(s, util.pytorch_cos_sim(summary_embedding, emb).item()) for s, emb in style_embeddings.items()]
    similarities = sorted(similarities, key=lambda x: x[1], reverse=True)
    top_style, top_score = similarities[0]
    second_style, second_score = similarities[1]
    styles = [(top_style, 0.7), (second_style, 0.3)] if top_score - second_score < 0.05 else [(top_style, 1.0)]

    mood = max(moods, key=lambda m: util.pytorch_cos_sim(summary_embedding, mood_embeddings[m]).item())
    persona = max(personas, key=lambda p: util.pytorch_cos_sim(summary_embedding, persona_embeddings[p]).item())

    RULES = []
    for style, weight in styles:
        RULES.append(f"({int(weight * 100)}%) Follow {style} style elements.")

    RULES.append(f"Reflect a {mood} mood.")
    RULES.append(f"Tailor the design for a {persona} user.")

    if window_positions:
        RULES.insert(0, "Preserve the detected window positions exactly as they are; do not alter, move, or resize them.")
        RULES.insert(1, "Do not add any new physical structures like windows or walls.")
    else:
        RULES.insert(0, "No window positions detected. Avoid adding any new structural elements unless specified.")

    return RULES

# STEP 4: BUILD PROMPT
window_positions = []  # Roboflow disabled
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

print("Prompt:", prompt)

# STEP 5: ROOMGPT GENERATION
with open(IMAGE_PATH, "rb") as img_file:
    b64_image = base64.b64encode(img_file.read()).decode("utf-8")

payload = {
    "version": ROOMGPT_MODEL_VERSION,
    "input": {
        "seed": 20,
        "image": f"data:image/jpeg;base64,{b64_image}",
        "prompt": prompt,
        "structure": "scribble",
        "image_resolution": 512
    }
}

headers = {
    "Authorization": f"Token {ROOMGPT_API_TOKEN}",
    "Content-Type": "application/json",
}

response = requests.post(ROOMGPT_API_URL, headers=headers, json=payload)

if response.status_code == 201:
    prediction = response.json()
    status_url = prediction["urls"]["get"]
    print("Generation started:", status_url)

    while True:
        status = requests.get(status_url, headers={"Authorization": f"Token {ROOMGPT_API_TOKEN}"})
        if status.status_code == 200:
            result = status.json()
            if result["status"] == "succeeded":
                image_url = result["urls"]["stream"]
                print("✅ Generation Complete:", image_url)
                try:
                    # Save the image locally
                    image_data = requests.get(image_url).content
                    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
                    save_path = f"C:/Users/najja/OneDrive/Desktop/kitchance-project-3-master/generated_kitchen_{timestamp}.jpg"
                    with open(save_path, "wb") as handler:
                        handler.write(image_data)
                    print("Saved to:", save_path)

                    # 🛠 Open the online RoomGPT URL in the browser
                    time.sleep(1)
                    webbrowser.open(image_url)

                except Exception as e:
                    print("Warning: Image download failed:", e)
                break
            elif result["status"] in ["failed", "canceled"]:
                print("❌ Generation failed.")
                break
            else:
                print("⏳ Processing...")
                time.sleep(5)
        else:
            print("Warning: Error while polling status:", status.text)
            break
else:
    print(f"❌ Failed to start generation: {response.status_code}, {response.text}")
