# services/translation_service.py
from googletrans import Translator

translator = Translator()

def translate_to_english(text, language):
    if language in ['bn', 'hi']:
        translated = translator.translate(text, src=language, dest='en')
        return translated.text
    return text
