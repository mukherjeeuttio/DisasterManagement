# services/recording_service.py
import os
import requests
import time
from config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN

def download_recording(recording_url, call_sid, retries=5, delay=3):
    for attempt in range(retries):
        response = requests.get(recording_url, auth=(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN))

        if response.status_code == 200:
            file_name = f"{call_sid}.wav"
            with open(file_name, 'wb') as f:
                f.write(response.content)
            return file_name
        else:
            print(f"Failed to download recording: {response.status_code}. Retrying in {delay} seconds...")
            time.sleep(delay)

    print("Max retries reached. Unable to download the recording.")
    return None
