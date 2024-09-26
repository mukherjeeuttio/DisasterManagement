from google.cloud import speech_v1p1beta1 as speech
import io

def transcribe_audio(file_path, selected_language):
    client = speech.SpeechClient()

    # Load the audio file
    with io.open(file_path, "rb") as audio_file:
        content = audio_file.read()

    # Configure the audio and recognition settings
    audio = speech.RecognitionAudio(content=content)
    
    # Map selected_language to Google Cloud language codes
    language_code_map = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'bn': 'bn-IN'
    }
    
    language_code = language_code_map.get(selected_language, 'en-US')

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=8000,  # Update based on your audio file
        language_code=language_code,
    )

    # Perform speech recognition
    response = client.recognize(config=config, audio=audio)

    # Concatenate results
    transcription_text = ""
    for result in response.results:
        transcription_text += result.alternatives[0].transcript + " "

    return transcription_text.strip()
