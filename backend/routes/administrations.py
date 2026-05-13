from flask import Blueprint, jsonify

administrations_bp = Blueprint("administrations", __name__)

ADMINISTRATIONS = [
    {
        "name": "Préfecture Casablanca",
        "type": "Passeport",
        "city": "Casablanca",
        "hours": "08:30 - 16:30"
    },

    {
        "name": "Centre Visa Rabat",
        "type": "Visa étudiant",
        "city": "Rabat",
        "hours": "09:00 - 14:00"
    }
]

@administrations_bp.route("/api/administrations", methods=["GET"])
def get_administrations():

    return jsonify(ADMINISTRATIONS)