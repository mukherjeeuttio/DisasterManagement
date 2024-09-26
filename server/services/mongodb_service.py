# services/mongodb_service.py
from pymongo import MongoClient

# MongoDB Atlas connection string (replace <username>, <password>, and <cluster-url> with your credentials)
MONGODB_URI = "mongodb+srv://Bhalu:DMD_Hack2004@disastermanagementdatab.6mjxk.mongodb.net/?retryWrites=true&w=majority&appName=DisasterManagementDatabase&ipv6=false"
client = MongoClient(MONGODB_URI)

# Select the database and collection
db = client['DisManDatabase']  # Replace 'myDatabase' with your database name
collection = db['DisManCollection']  # Replace 'transcriptions' with your collection name

def store_transcription_data(transcribed_text, ai_response):
    """
    Store transcribed text and AI response in MongoDB.
    """
    try:
        document = {
            'transcribed_text': transcribed_text,
            'ai_response': ai_response
        }
        result = collection.insert_one(document)
        print(f"Data inserted with ID: {result.inserted_id}")
    except Exception as e:
        print(f"Error inserting data into MongoDB: {e}")
        raise
