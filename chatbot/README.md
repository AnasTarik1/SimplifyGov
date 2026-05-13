# 🏛️ SimplifyGov – Assistant Administratif Intelligent

> Simplifiez vos démarches administratives grâce à l'IA Gemini

---

## 🚀 Démarrage rapide

### Prérequis
- Python 3.9+
- Clé API Google Gemini → [Obtenir ici](https://aistudio.google.com/app/apikey)

### Linux / macOS
```bash
chmod +x start.sh
./start.sh
```

### Windows
```
Double-cliquer sur start.bat
```

### Manuel
```bash
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate.bat       # Windows

pip install -r requirements.txt

python app.py
```

Puis ouvrir : **http://localhost:5000**

---

## 🔑 Configuration de la clé API

1. Démarrez l'application
2. Une fenêtre s'affiche pour entrer votre clé Gemini
3. Entrez votre clé `AIza...`
4. Cliquez sur **Démarrer ✨**

Ou via variable d'environnement :
```bash
cp .env.example .env
# Éditez .env et ajoutez votre GEMINI_API_KEY
```

---

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 💬 Chat intelligent | Réponses IA instantanées |
| 📄 Analyse PDF | Lecture et résumé de documents |
| 🖼️ OCR Images | Lecture de documents photographiés |
| 📌 Extraction | Dates, coûts, étapes, documents requis |
| 🌍 Multilingue | Français, العربية, English |
| 📱 Interface moderne | Style WhatsApp responsive |

---

## 📂 Structure du projet

```
SimplifyGov/
├── app.py                 # Serveur Flask principal
├── requirements.txt       # Dépendances Python
├── start.sh               # Script démarrage Linux/Mac
├── start.bat              # Script démarrage Windows
├── .env.example           # Template variables d'environnement
├── uploads/               # Fichiers temporaires uploadés
└── frontend/
    ├── index.html         # Interface principale
    └── static/
        ├── css/style.css  # Styles
        └── js/app.js      # Logique frontend
```

---

## 🛣️ Routes API

| Route | Méthode | Description |
|---|---|---|
| `/` | GET | Interface web |
| `/api/config` | GET | Vérifier config |
| `/api/config` | POST | Définir clé API |
| `/api/chat` | POST | Chat avec historique |
| `/api/analyze` | POST | Analyse rapide document |
| `/api/health` | GET | Santé du service |

---

## 🔧 Modèle utilisé

**`models/gemini-2.5-flash`** – Rapide, précis, multimodal (texte + PDF + images)

---

## 📝 Exemple de réponse

```
📄 Résumé :
Ce document est une convocation pour le renouvellement de votre CIN.

📌 Informations importantes :
✅ Vous devez vous présenter en personne
✅ Apportez votre ancienne carte d'identité
✅ Une photo récente est requise

📅 Dates importantes :
✅ Avant le 15 juin 2025

💰 Coûts :
✅ Gratuit pour le premier renouvellement

📋 Documents requis :
✅ Ancienne CIN
✅ Photo d'identité récente (moins de 3 mois)
✅ Justificatif de domicile (facture eau ou électricité)

⚠️ Attention :
Présentez-vous entre 8h et 16h du lundi au vendredi.
```

---

## 👥 Hackathon 2025

Projet développé lors d'un hackathon pour moderniser l'accès aux services administratifs.
