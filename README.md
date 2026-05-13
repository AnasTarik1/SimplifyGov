# SimplifyGov

SimplifyGov est une application web développée dans le cadre d’un hackathon.  
Le projet vise à simplifier l’accès aux services administratifs en proposant une plateforme intelligente permettant aux utilisateurs de rechercher des démarches, consulter les documents nécessaires, interagir avec un chatbot et déposer des documents.

## Objectif du projet

L’objectif principal de SimplifyGov est de faciliter les démarches administratives pour les citoyens en centralisant les informations et en automatisant une partie de l’assistance grâce à un chatbot.

La plateforme permet de réduire la complexité des procédures administratives, d’orienter l’utilisateur vers le bon service et de l’aider à préparer les documents nécessaires.

## Fonctionnalités principales

- Consultation des démarches administratives
- Recherche rapide des services disponibles
- Chatbot d’assistance pour guider l’utilisateur
- Upload de documents administratifs
- Gestion des documents déposés
- Backend API pour gérer les données
- Frontend web pour l’interface utilisateur
- Architecture conteneurisée avec Docker
- Séparation claire entre backend, frontend et chatbot

## Technologies utilisées

### Backend

- Python
- Flask / FastAPI selon la configuration du projet
- API REST
- SQLite
- Docker

### Frontend

- React.js
- JavaScript
- HTML
- CSS
- Vite ou environnement Node.js

### Chatbot

- Python
- Traitement automatique des requêtes utilisateur
- Intégration possible avec une API d’intelligence artificielle

### Outils

- Docker
- Docker Compose
- Git
- GitHub
- Node.js
- npm

## Structure du projet

```txt
SimplifyGov/
│
├── backend/
│   ├── config/
│   ├── core/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   │   └── documents/
│   ├── app.py
│   ├── Dockerfile
│   ├── manage.py
│   └── requirements.txt
│
├── chatbot/
│
├── frontend/
│
├── docker-compose.yml
├── package.json
├── package-lock.json
├── .gitignore
├── .env.example
└── README.md
```

## Installation du projet

### 1. Cloner le repository

```bash
git clone https://github.com/AnasTarik1/SimplifyGov.git
cd SimplifyGov
```

## Configuration des variables d’environnement

Créer un fichier `.env` à la racine du projet en se basant sur le fichier `.env.example`.

Exemple de fichier `.env` :

```env
SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3

VITE_API_URL=http://localhost:8000

OPENAI_API_KEY=your_openai_api_key
CHATBOT_API_KEY=your_chatbot_api_key
```

> Important : le fichier `.env` contient des informations sensibles et ne doit jamais être envoyé sur GitHub.

Le fichier `.env.example` sert uniquement de modèle et peut être partagé.

## Installation du backend

### 1. Accéder au dossier backend

```bash
cd backend
```

### 2. Créer un environnement virtuel

```bash
python -m venv venv
```

### 3. Activer l’environnement virtuel

Sur Windows :

```bash
venv\Scripts\activate
```

Sur Linux / macOS :

```bash
source venv/bin/activate
```

### 4. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 5. Lancer le backend

Selon la configuration du projet, lancer l’une des commandes suivantes :

```bash
python app.py
```

ou :

```bash
python manage.py runserver
```

Le backend sera généralement disponible sur :

```txt
http://localhost:8000
```

ou :

```txt
http://127.0.0.1:5000
```

## Installation du frontend

### 1. Accéder au dossier frontend

Depuis la racine du projet :

```bash
cd frontend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer le frontend

```bash
npm run dev
```

Le frontend sera généralement disponible sur :

```txt
http://localhost:5173
```

## Lancement avec Docker

Le projet contient un fichier `docker-compose.yml`, ce qui permet de lancer les services avec Docker.

Depuis la racine du projet :

```bash
docker-compose up --build
```

Pour arrêter les conteneurs :

```bash
docker-compose down
```

## Gestion des fichiers sensibles

Les fichiers suivants ne doivent pas être envoyés sur GitHub :

```txt
.env
db.sqlite3
node_modules/
uploads/
__pycache__/
venv/
```

Ils sont ignorés grâce au fichier `.gitignore`.

## Exemple de `.gitignore`

```gitignore
# Environment variables
.env
.env.*
!.env.example

# Node
node_modules/
dist/
build/

# Python
venv/
env/
.venv/
__pycache__/
*.pyc
*.pyo
*.pyd

# Database
db.sqlite3
*.sqlite3

# Uploads
uploads/
backend/uploads/

# IDE / System
.vscode/
.idea/
.DS_Store
Thumbs.db
```

## Sécurité

Pour protéger le projet :

- Les clés API ne sont pas écrites directement dans le code.
- Les variables sensibles sont placées dans un fichier `.env`.
- Le fichier `.env` est ignoré par Git.
- La base de données locale `db.sqlite3` n’est pas envoyée sur GitHub.
- Les fichiers uploadés par les utilisateurs ne sont pas envoyés sur GitHub.
- Les dossiers générés automatiquement comme `node_modules`, `venv` et `__pycache__` sont ignorés.

## Commandes Git utiles

Pour envoyer le projet sur GitHub :

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/AnasTarik1/SimplifyGov.git
git push -u origin main
```

Si le remote existe déjà :

```bash
git remote set-url origin https://github.com/AnasTarik1/SimplifyGov.git
git push -u origin main
```

Pour envoyer les prochaines modifications :

```bash
git add .
git commit -m "Update project"
git push
```

## Auteur

Projet réalisé par :

**Anas Tarik**

## Contexte

Projet réalisé dans le cadre d’un hackathon.

## Statut du projet

Projet en cours de développement.
