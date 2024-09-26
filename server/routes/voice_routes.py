# routes/voice_routes.py
import os
from flask import Blueprint, request, jsonify
from services.twilio_service import create_voice_response, gather_language_selection_message
from services.recording_service import download_recording
from services.whisper_service import transcribe_audio
from services.translation_service import translate_to_english
from services.ai_service import extract_info_and_analyze

voice_bp = Blueprint('voice', __name__)

@voice_bp.route("/voice", methods=['POST'])
def voice():
    message = gather_language_selection_message()
    return str(create_voice_response(message))  # Convert to string

@voice_bp.route("/language-selection", methods=['POST'])
def language_selection():
    selected_language = request.form.get("Digits")
    
    if selected_language == '1':
        language = 'en'
        message = "You selected English. Please describe your situation."
    elif selected_language == '2':
        language = 'bn'
        message = "Aapni Bangla bhasha choyon korechen. Doya Kore Aapnar bortoman Poristhitir biboron din."
    elif selected_language == '3':
        language = 'hi'
        message = "Aapne Hindi chuna hai. Kripya apne paristhiti ka varnan kare."
    else:
        return jsonify({"error": "Invalid selection"}), 400

    # Store selected language in session or any temporary storage
    request.environ['selected_language'] = language

    # Create the VoiceResponse object for Twilio
    resp = create_voice_response(message)
    
    # Add recording functionality here
    resp.record(max_length=120, action="/handle-recording", method="POST")
    
    return str(resp)  # Convert to string

@voice_bp.route("/handle-recording", methods=['POST'])
def handle_recording():
    recording_url = request.form.get("RecordingUrl")
    call_sid = request.form.get("CallSid")
    selected_language = request.environ.get('selected_language')

    if not recording_url or not call_sid:
        return jsonify({"error": "Missing data from Twilio"}), 400

    # Handle recording logic...
    file_name = download_recording(recording_url, call_sid)

    if not file_name:
        return jsonify({"error": "Failed to download recording"}), 500

    transcription_text = transcribe_audio(file_name, selected_language)

    if not transcription_text:
        return jsonify({"error": "Transcription failed"}), 500

    # Translate to English if needed
    if selected_language in ['hi', 'bn']:
        transcription_text = translate_to_english(transcription_text, selected_language)

    genai_results = extract_info_and_analyze(transcription_text)

    if genai_results:
        print("Generative AI Analysis Results:", genai_results)
    else:
        print("Generative AI analysis failed.")

    # Clean up
    os.remove(file_name)
    return jsonify({"message": "Call recorded, transcribed, and analyzed successfully."})
