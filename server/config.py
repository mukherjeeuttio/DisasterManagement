from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Fetch the variables
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
GOOGLE_APPLICATION_CREDENTIALS = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN or not GOOGLE_API_KEY or not GOOGLE_APPLICATION_CREDENTIALS:
    raise ValueError("One or more API keys not set in environment variables.")
