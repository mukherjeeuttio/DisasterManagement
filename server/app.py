# app.py
from flask import Flask
from routes.voice_routes import voice_bp
from config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, GOOGLE_API_KEY, GOOGLE_APPLICATION_CREDENTIALS

app = Flask(__name__)
app.register_blueprint(voice_bp)

if __name__ == "__main__":
    app.run(debug=True)
