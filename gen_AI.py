from dotenv import load_dotenv
import google.generativeai as genai
import os

# Load environment variables
load_dotenv()

# Configure the Google Generative AI API with the API key
genai.configure(api_key=os.getenv("API_KEY_GEM"))

# Function to prompt the API to extract named entities and detect disaster sentiment
def extract_info_and_analyze(text):
    # Build a prompt that asks the API to identify names, addresses, and detect disaster-related sentiment
    prompt = f"""
    Given the following text:
    
    "{text}"
    
    1. Identify and extract all names (e.g., persons).
    2. Identify and extract all addresses or places.
    3. Analyze the sentiment and tell if the text mentions any disasters like fire, earthquake, crime, floods, etc.
    4. Return the extracted names, addresses, and the disaster/issue.

    Give the output in json.
    """
    
    # Send the request to the model
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    
    return response.text

# Input: The text where we want to perform entity extraction and sentiment analysis
input_text = "John Doe lives in New York City. Recently, there was a fire in his neighborhood, causing panic."

# Call the function to get the extracted entities and sentiment analysis
extracted_info = extract_info_and_analyze(input_text)

# Output the results
print("Extracted Information:")
print(extracted_info)
