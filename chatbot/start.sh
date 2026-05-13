#!/bin/bash
# ════════════════════════════════════════════
# SimplifyGov – Script de démarrage
# ════════════════════════════════════════════

echo ""
echo "🏛️  SimplifyGov – Assistant Administratif Intelligent"
echo "══════════════════════════════════════════════════════"
echo ""

# Vérifier Python
if ! command -v python3 &>/dev/null; then
  echo "❌ Python 3 n'est pas installé."
  exit 1
fi

# Créer l'environnement virtuel si besoin
if [ ! -d "venv" ]; then
  echo "📦 Création de l'environnement virtuel..."
  python3 -m venv venv
fi

# Activer le venv
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null

# Installer les dépendances
echo "📥 Installation des dépendances..."
pip install -r requirements.txt -q

# Charger .env si présent
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
  echo "✅ Variables .env chargées"
fi

echo ""
echo "🚀 Démarrage du serveur Flask..."
echo "🌐 Ouvrez : http://localhost:5000"
echo "🔑 Entrez votre clé Gemini dans l'interface"
echo ""
echo "Ctrl+C pour arrêter."
echo ""

python3 app.py
