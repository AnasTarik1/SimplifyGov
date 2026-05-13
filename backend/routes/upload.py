from flask import Blueprint, request, jsonify
import os

from services.ocr_service import extract_text
from services.document_detector import detect_document_type

upload_bp = Blueprint("upload", __name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@upload_bp.route("/api/upload", methods=["POST"])
def upload_document():

    if "file" not in request.files:
        return jsonify({
            "error": "Aucun fichier envoyé"
        }), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({
            "error": "Nom fichier vide"
        }), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    extracted_text = extract_text(filepath)

    detected_type = detect_document_type(
        extracted_text,
        file.filename
    )

    return jsonify({
        "message": "Document uploadé et analysé avec succès",
        "filename": file.filename,
        "detected_type": detected_type,
        "extracted_text": extracted_text[:1000]
    })