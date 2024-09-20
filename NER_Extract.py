import requests
from config import API_TOKEN_HF
API_URL = "https://api-inference.huggingface.co/models/dbmdz/bert-large-cased-finetuned-conll03-english"

# Model URL for NER task
def ner_inference(text_data, API_TOKEN_HF):
    # Headers with Authorization
    headers = {"Authorization": f"Bearer {API_TOKEN_HF}"}

    # Input text (example)
    data = {"inputs": text_data}

    # Make the request
    try:
        response = requests.post(API_URL, headers=headers, json=data)
        response.raise_for_status()  # Ensure we catch any HTTP errors
        return response.json()
    
    except requests.exceptions.RequestException as e:
        print(f"Error during NER API call: {e}")
        return None
