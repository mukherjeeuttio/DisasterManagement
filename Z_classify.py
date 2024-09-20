import requests
from config import API_TOKEN_HF
API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli"

def Z_classify_inference(text_data, candidate_labels):
    # Input text and candidate labels
    candidate_labels = ["fire", "flood", "earthquake"]

    # Define headers for the API request
    headers = {
        "Authorization": f"Bearer {API_TOKEN_HF}",
        "Content-Type": "application/json"
    }

    # Define payload for the API request
    payload = {
        "inputs": text_data,
        "parameters": {
            "candidate_labels": candidate_labels
        }
    }

    # Make the POST request to the API
    response = requests.post(API_URL, headers=headers, json=payload)

    # Check if the request was successful
    if response.status_code == 200:
        return response.json()  # Get NLI classification result
    else:
        print(f"NLI API Error: {response.status_code}")
        print(response.text)
        return None
