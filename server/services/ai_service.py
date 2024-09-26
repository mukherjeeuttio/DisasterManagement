# services/ai_service.py
import google.generativeai as genai

def extract_info_and_analyze(text):
    prompt = f"""
    Given the following text:

    "{text}"

    1. Identify and extract all names (e.g., persons).
    2. Identify and extract all addresses or places.
    3. Analyze the sentiment and tell if the text mentions any disasters like fire, earthquake, crime, floods, etc.
    4. Return the extracted names, addresses, and the disaster/issue in json format.
    """

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error with Generative AI API: {e}")
        return None
