# services/whisper_service.py
import whisper

model = whisper.load_model("base")

def transcribe_audio(file_name, language):
    try:
        if language == 'bn':
            result = model.transcribe(file_name, language='bn')
        elif language == 'hi':
            result = model.transcribe(file_name, language='hi')
        else:
            result = model.transcribe(file_name)

        return result['text']
    except Exception as e:
        print(f"Error during transcription: {e}")
        return None
