import os
import requests
from flask import Flask, request, jsonify
from twilio.twiml.voice_response import VoiceResponse
import whisper
import time

from NER_Extract import ner_inference
from Z_classify import Z_classify_inference
from config import API_TOKEN_HF

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

    # Download the recording with retry logic
    file_name = download_recording(recording_url, call_sid)

    if not file_name:
        return "Failed to download recording", 500

    # Transcribe the audio using Whisper
    transcription_text = transcribe_audio(file_name)

    if not transcription_text:
        return "Transcription failed", 500

    transcriptions[call_sid] = transcription_text  # Save the transcription
    print(f"Transcription: {transcription_text}")

    # Process the transcription with ML models
    process_audio(transcription_text, API_TOKEN_HF)

    # Clean up the audio file
    os.remove(file_name)

    return "Call recorded and transcribed successfully."

def download_recording(recording_url, call_sid):
    # Your Twilio Account SID and Auth Token
    account_sid = 'AC777f91e00fbc880a45990c94a9eecb18'
    auth_token = 'bb7c213c01581e496dfd6f1ab0375941'

    # Determine the format (either .mp3 or .wav) based on what Twilio provides
    file_formats = [".wav", ".mp3"]

    for file_format in file_formats:
        try:
            full_url = f"{recording_url}{file_format}"

            print(f"Attempting to download recording: {full_url}")
            
            # Twilio requires authentication to download the recording
            response = requests.get(full_url, auth=(account_sid, auth_token))

            if response.status_code == 200:
                # Save the audio file locally
                file_name = f"{call_sid}{file_format}"
                with open(file_name, 'wb') as f:
                    f.write(response.content)
                print(f"Recording downloaded successfully: {file_name}")
                return file_name
            else:
                print(f"Failed to download recording: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"Error downloading recording: {e}")
    
    return None

def transcribe_audio(file_name):
    try:
        # Transcribe audio file using Whisper
        result = model.transcribe(file_name)
        return result['text']
    except Exception as e:
        print(f"Error during transcription: {e}")
        return None

# Function to process audio transcription with ML models
def process_audio(transcribed_text, api_token):
    if not transcribed_text:
        print("No transcribed text found. Exiting...")
        return

    # NER Inference
    ner_results = ner_inference(transcribed_text, api_token)
    z_class_results = Z_classify_inference(transcribed_text, api_token)

    if ner_results:
        print("Named Entities Detected:", ner_results)
    else:
        print("NER inference failed. Possibly due to bad input.")

    if z_class_results:
        print("Z-class Detected:", z_class_results)
    else:
        print("Z-class inference failed.")

if __name__ == "__main__":
    app.run(debug=True)
