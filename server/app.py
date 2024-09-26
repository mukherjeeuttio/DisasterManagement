# app.py
from flask import Flask, session
from routes.voice_routes import voice_bp
from config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, GOOGLE_API_KEY, GOOGLE_APPLICATION_CREDENTIALS

app = Flask(__name__)
app.register_blueprint(voice_bp)
app.secret_key = '3a0450f70b149679abb3a5f004c759da'
if __name__ == "__main__":
    app.run(debug=True)
