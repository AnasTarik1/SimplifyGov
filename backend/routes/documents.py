from flask import Blueprint, request, jsonify
from services.procedures_service import PROCEDURES

documents_bp = Blueprint("documents", __name__)

@documents_bp.route("/api/check-documents", methods=["POST"])
def check_documents():

    data = request.get_json()

    procedure = data.get("procedure", "").lower()
    uploaded_docs = data.get("documents", [])

    if procedure not in PROCEDURES:
        return jsonify({
            "error": "Procédure inconnue"
        }), 404

    required_docs = PROCEDURES[procedure]["documents"]

    missing = [
        doc for doc in required_docs
        if doc not in uploaded_docs
    ]

    present = [
        doc for doc in required_docs
        if doc in uploaded_docs
    ]

    return jsonify({
        "procedure": procedure,
        "present": present,
        "missing": missing,
        "complete": len(missing) == 0
    })