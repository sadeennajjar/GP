import os
import sqlite3
import bcrypt
import datetime
import time
import json
import requests
from flask import Flask, request, jsonify, send_from_directory
from database import save_transcript, initialize_db
from init_db import initialize_db
import base64
from flask_cors import CORS

app = Flask(__name__)
initialize_db()
CORS(app, supports_credentials=True) 
# === CORS Support ===
def extract_full_transcript(data):
    try:
        messages = data.get("message", {}).get("artifact", {}).get("messages", [])
        lines = []
        for msg in messages:
            role = msg.get("role")
            text = msg.get("message") or msg.get("content") or ""
            if role and text:
                lines.append(f"{role.capitalize()}: {text.strip()}")
        return "\n".join(lines)
    except Exception as e:
        print("Error extracting transcript:", e)
        return ""

@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    allowed_origins = [
        "http://localhost:8080",
        " https://d28c-94-249-51-113.ngrok-free.app"
    ]
    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response
@app.route('/routes')
def list_routes():
    import urllib
    routes = []
    for rule in app.url_map.iter_rules():
        methods = ','.join(rule.methods)
        url = urllib.parse.unquote(str(rule))
        routes.append(f"{url} [{methods}]")
    return "<br>".join(routes)

# === Authentication Routes ===
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password").encode("utf-8")

    conn = sqlite3.connect("kitchance_transcripts.db")
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email = ?", (email,))
    if c.fetchone():
        return jsonify({"success": False, "message": "Email already exists"}), 400

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

@app.route('/')
def home():
    return "KitChance Transcript Webhook is live!"

@app.route('/latest-transcript', methods=['GET'])
def latest_transcript():
    try:
        conn = sqlite3.connect('kitchance_transcripts.db')
        cursor = conn.cursor()
        cursor.execute('SELECT transcript FROM transcripts ORDER BY timestamp DESC LIMIT 1')
        result = cursor.fetchone()
        conn.close()
        return jsonify({"transcript": result[0]}) if result else jsonify({"error": "No transcript found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ FIXED: Route now correctly extracts subpath and serves from correct folder
@app.route('/outputs/<path:filename>')
def serve_generated_image(filename):
    return send_from_directory('outputs', filename)
# === Transcript → Forward to SDXL pod ===
@app.route('/transcript', methods=['POST', 'OPTIONS'])
@app.route('/transcript', methods=['POST', 'OPTIONS'])
def receive_transcript():
    if request.method == "OPTIONS":
        return '', 204

    try:
        data = request.json
        print("📨 Full payload:", data)

        transcript_text = data.get("transcript", "")

        if not transcript_text:
            transcript_text = extract_full_transcript(data)

        if not transcript_text:
            return jsonify({"error": "Transcript not found"}), 400

        print("📝 Extracted transcript:", transcript_text)

        # Forward to SDXL backend
        sdxl_backend_url = "https://8910-213-192-2-87.ngrok-free.app/generate_kitchen"
        response = requests.post(
            sdxl_backend_url,
            headers={"Content-Type": "application/json"},
            json={"transcript": transcript_text}
        )

        if response.status_code != 200:
            print("❌ SDXL backend error:", response.text)
            return jsonify({"error": "SDXL backend error"}), 500

        result = response.json()
        image_url = result.get("image_url", "")
        print("✅ Image URL received:", image_url)

        if not image_url:
            return jsonify({"error": "No image URL returned"}), 500

        return jsonify({
            "status": "success",
            "image_url": image_url
        })

    except Exception as e:
        print("❌ Error in /transcript:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=4000)
