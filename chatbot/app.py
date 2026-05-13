"""
SimplifyGov - Assistant administratif intelligent
Hackathon 2025
"""

import os
import json
import base64
import mimetypes
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
import google.generativeai as genai
from datetime import datetime
import PyPDF2
import io
from dotenv import load_dotenv

load_dotenv()

# ─────────────────────────────────────────
# Configuration Flask
# ─────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__,
            template_folder=os.path.join(BASE_DIR, "frontend"),
            static_folder=os.path.join(BASE_DIR, "frontend", "static"))
CORS(app)

app.config["UPLOAD_FOLDER"] = os.path.join(BASE_DIR, "uploads")
app.config["MAX_CONTENT_LENGTH"] = 20 * 1024 * 1024
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "webp", "gif"}
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

def get_gemini_model():
    return genai.GenerativeModel("models/gemini-2.5-flash")

# ─────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_pdf_text(file_bytes):
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text.strip()
    except:
        return ""

def build_system_prompt():
    return """Tu es SimplifyGov, un assistant administratif intelligent et bienveillant.
Tu aides les citoyens à comprendre les documents administratifs complexes.

LANGUE : Réponds toujours dans la même langue que l'utilisateur (français, arabe, anglais).

STYLE :
- Utilise des emojis pertinents
- Réponses courtes, claires, structurées
- Langage simple et humain

FORMAT POUR LES DOCUMENTS :
📄 **Résumé :**
[résumé court]

📌 **Informations importantes :**
✅ [info 1]
✅ [info 2]

📅 **Dates importantes :**
✅ [date]

💰 **Coûts :**
✅ [montant]

📋 **Documents requis :**
✅ [document]

🔢 **Étapes à suivre :**
1️⃣ [étape 1]
2️⃣ [étape 2]

⚠️ **Attention :**
[points importants]

SIMPLIFICATION : Remplace le jargon par des mots simples.
"""

def chat_with_gemini(messages, file_data=None, file_type=None):
    model = get_gemini_model()
    system = build_system_prompt()

    history = []
    for msg in messages[:-1]:
        role = "user" if msg["role"] == "user" else "model"
        history.append({"role": role, "parts": [msg["content"]]})

    chat = model.start_chat(history=history)
    last_user_msg = messages[-1]["content"]
    parts = [system + "\n\n" + last_user_msg]

    if file_data and file_type:
        if file_type == "application/pdf":
            pdf_text = extract_pdf_text(file_data)
            if pdf_text:
                parts = [system + "\n\nDocument PDF :\n\n" + pdf_text + "\n\n" + last_user_msg]
            else:
                parts = [system + "\n\n" + last_user_msg,
                         {"mime_type": "application/pdf", "data": base64.b64encode(file_data).decode()}]
        elif file_type.startswith("image/"):
            parts = [system + "\n\n" + last_user_msg,
                     {"mime_type": file_type, "data": base64.b64encode(file_data).decode()}]

    response = chat.send_message(parts)
    return response.text

# ─────────────────────────────────────────
# Routes
# ─────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        messages = json.loads(request.form.get("messages", "[]"))
        user_message = request.form.get("message", "").strip()

        if not user_message and "file" not in request.files:
            return jsonify({"error": "Message vide"}), 400

        if user_message:
            messages.append({"role": "user", "content": user_message})

        file_data = None
        file_type = None

        if "file" in request.files:
            file = request.files["file"]
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_data = file.read()
                file_type = file.content_type or mimetypes.guess_type(filename)[0]
                if not user_message:
                    if file_type == "application/pdf":
                        auto_msg = f"📎 Document PDF : **{filename}**\n\nAnalyse-le, résume-le et extrais les informations importantes."
                    else:
                        auto_msg = f"🖼️ Image : **{filename}**\n\nLis et analyse ce document."
                    messages.append({"role": "user", "content": auto_msg})

        if not messages:
            return jsonify({"error": "Aucun message"}), 400

        response_text = chat_with_gemini(messages, file_data, file_type)
        messages.append({"role": "assistant", "content": response_text})

        return jsonify({
            "response": response_text,
            "messages": messages,
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({"error": f"Erreur : {str(e)}"}), 500

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "SimplifyGov"})

if __name__ == "__main__":
    print("🚀 SimplifyGov → http://localhost:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
