import os
import requests
from flask import Flask, request, jsonify
from twilio.twiml.voice_response import VoiceResponse
import whisper
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables for API keys
load_dotenv()

# Check if API key is loaded
API_KEY_GEM = os.getenv("API_KEY_GEM")
if not API_KEY_GEM:
    raise ValueError("API_KEY_GEM not set in environment variables.")

# Configure the Google Generative AI API with the API key
genai.configure(api_key=API_KEY_GEM)

app = Flask(__name__)

# Dictionary to store recording URLs and transcriptions
recordings = {}
transcriptions = {}

# Load the Whisper model globally
model = whisper.load_model("base")  # Options: "tiny", "base", "small", "medium", "large"

# Route to handle incoming calls
@app.route("/voice", methods=['POST'])
def voice():
    resp = VoiceResponse()
    resp.say(
        "You are connected to the emergency services. Please describe your situation.",
        voice='alice'
    )
    # Record the call and redirect to handle-recording after completion
    resp.record(max_length=120, action="/handle-recording")
    return str(resp)

# Route to handle the recording after the call is completed
@app.route("/handle-recording", methods=['POST'])
def handle_recording():
    recording_url = request.form.get("RecordingUrl")
    call_sid = request.form.get("CallSid")  # Unique ID for the call

    if not recording_url or not call_sid:
        return "Missing data from Twilio", 400

    recordings[call_sid] = recording_url  # Save the recording URL
    print(f"Recording available at: {recording_url}")

    # Download the recording
    file_name = download_recording(recording_url, call_sid)

    if not file_name:
        return "Failed to download recording", 500

    # Transcribe the audio using Whisper
    transcription_text = transcribe_audio(file_name)

    if not transcription_text:
        return "Transcription failed", 500

    transcriptions[call_sid] = transcription_text  # Save the transcription
    print(f"Transcription: {transcription_text}")

    # Process the transcription with GenAI
    genai_results = extract_info_and_analyze(transcription_text)

    if genai_results:
        print("Generative AI Analysis Results:", genai_results)
    else:
        print("Generative AI analysis failed.")

    # Clean up the audio file
    os.remove(file_name)

    return "Call recorded, transcribed, and analyzed successfully."

def download_recording(recording_url, call_sid):
    # Your Twilio Account SID and Auth Token
    account_sid = 'AC777f91e00fbc880a45990c94a9eecb18'
    auth_token = 'bb7c213c01581e496dfd6f1ab0375941'

    # Correct the URL format
    full_url = recording_url

    # Twilio requires authentication to download the recording
    response = requests.get(full_url, auth=(account_sid, auth_token))

    if response.status_code != 200:
        print(f"Failed to download recording: {response.status_code}")
        return None

    # Save the audio file locally
    file_name = f"{call_sid}.wav"
    with open(file_name, 'wb') as f:
        f.write(response.content)

    return file_name

def transcribe_audio(file_name):
    try:
        # Transcribe audio file using Whisper
        result = model.transcribe(file_name)
        return result['text']
    except Exception as e:
        print(f"Error during transcription: {e}")
        return None

# Function to process audio transcription with Google Generative AI
def extract_info_and_analyze(text):
    # Build a prompt that asks the API to identify names, addresses, and disaster sentiment
    prompt = f"""
    Given the following text:
    
    "{text}"
    
    1. Identify and extract all names (e.g., persons).
    2. Identify and extract all addresses or places.
    3. Analyze the sentiment and tell if the text mentions any disasters like fire, earthquake, crime, floods, etc.
    4. Return the extracted names, addresses, and the disaster/issue in json format.
    """
    
    try:
        # Send the request to the model
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error with Generative AI API: {e}")
        return None

if __name__ == "__main__":
    app.run(debug=True)
