import requests
from requests.auth import HTTPBasicAuth

# Twilio credentials
ACCOUNT_SID = "AC777f91e00fbc880a45990c94a9eecb18"
AUTH_TOKEN = "bb7c213c01581e496dfd6f1ab0375941"
RECORDING_URL = "https://api.twilio.com/2010-04-01/Accounts/AC777f91e00fbc880a45990c94a9eecb18/Recordings/RE7df571e47f6a9b9906c18bf5e827991e.mp3"

# Download the recording
response = requests.get(RECORDING_URL, auth=HTTPBasicAuth(ACCOUNT_SID, AUTH_TOKEN))

# Save it locally
with open("recording.mp3", "wb") as f:
    f.write(response.content)

print("Recording downloaded successfully.")
