from flask import Flask, jsonify
from flask_cors import CORS

from routes.upload import upload_bp
from routes.documents import documents_bp
from routes.administrations import administrations_bp

app = Flask(__name__)

CORS(app)

app.register_blueprint(upload_bp)
app.register_blueprint(documents_bp)
app.register_blueprint(administrations_bp)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "SimplifyGov API running"
    })

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )