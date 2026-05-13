import pytesseract
from PIL import Image


def extract_text(file_path):
    try:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        return text
    except Exception:
        return ""


def detect_document_type(text, filename=""):
    content = f"{text} {filename}".lower()

    rules = {
        "passeport": ["passport", "passeport", "royaume du maroc", "kingdom of morocco"],
        "cin": ["carte nationale", "cin", "identité", "identity", "cnie"],
        "lettre_admission": ["admission", "acceptation", "université", "university"],
        "assurance": ["assurance", "insurance", "mutuelle"],
        "justificatif_ressources": ["banque", "bank", "relevé", "solde", "ressources"],
        "justificatif_domicile": ["adresse", "facture", "électricité", "domicile"],
        "photo": ["photo", "portrait"],
        "ancien_passeport": ["ancien passeport", "old passport"],
        "acte_naissance": ["naissance", "birth", "acte"],
    }

    for doc_type, keywords in rules.items():
        if any(keyword in content for keyword in keywords):
            return doc_type

    return "inconnu"