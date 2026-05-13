def detect_document_type(text, filename=""):
    content = (text + " " + filename).lower()

    rules = {
        "passeport": [
            "passport", "passeport", "royaume du maroc", "kingdom of morocco"
        ],
        "cin": [
            "carte nationale", "cin", "identité", "identity", "cnie"
        ],
        "lettre_admission": [
            "admission", "acceptation", "université", "university", "school"
        ],
        "assurance": [
            "assurance", "insurance", "coverage", "mutuelle"
        ],
        "justificatif_ressources": [
            "banque", "bank", "relevé", "salary", "solde", "ressources"
        ],
        "justificatif_domicile": [
            "adresse", "facture", "eau", "électricité", "domicile", "residence"
        ],
        "photo": [
            "photo", "image", "portrait"
        ],
        "ancien_passeport": [
            "ancien passeport", "old passport"
        ],
        "acte_naissance": [
            "naissance", "birth", "acte"
        ]
    }

    for doc_type, keywords in rules.items():
        for keyword in keywords:
            if keyword in content:
                return doc_type

    return "inconnu"