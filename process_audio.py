from NER_Extract import ner_inference
from Z_classify import Z_classify_inference
from config import API_TOKEN_HF

def process_audio(api_token):
    # Step 1: Speech-to-Text
    # transcribed_text = speech_to_text(audio_data)
    transcribed_text = "Abhirup Das goes to the park. The ground is shaking."  # Placeholder for actual STT output
    if not transcribed_text:
        print("No transcribed text found. Exiting...")
        return
    
    # Step 2: NER Inference
    ner_results = ner_inference(transcribed_text, api_token)
    z_class_results = Z_classify_inference(transcribed_text, api_token)
    
    if ner_results:
        print("Named Entities Detected:", ner_results)
    else:
        print("NER inference failed. Probally due to bad input ask the use to tell the name and address again. To be implemented in Twillow")

    if z_class_results:
        print("Z-class Detected:", z_class_results)
    else:
        print("Z-class inference failed.")

# Example usage
if __name__ == "__main__":
    process_audio(API_TOKEN_HF)
