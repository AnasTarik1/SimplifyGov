@echo off
echo.
echo =========================================
echo   SimplifyGov - Assistant Administratif
echo =========================================
echo.

:: Créer le venv si absent
if not exist "venv\" (
    echo Installation de l'environnement...
    python -m venv venv
)

:: Activer le venv
call venv\Scripts\activate.bat

:: Installer les dépendances
echo Installation des dependances...
pip install -r requirements.txt -q

echo.
echo Demarrage du serveur...
echo Ouvrez : http://localhost:5000
echo.

python app.py
pause
