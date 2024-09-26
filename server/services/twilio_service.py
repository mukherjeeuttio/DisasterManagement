# services/twilio_service.py
from twilio.twiml.voice_response import VoiceResponse

def create_voice_response(message):
    resp = VoiceResponse()
    gather = resp.gather(num_digits=1, action="/language-selection", method="POST")
    gather.say(message, voice='alice')
    return resp

def gather_language_selection_message():
    return "For English, press 1. Banglay Shunte hole 2 tipun. Hindi mein shunne ke liye 3 dabaye."
