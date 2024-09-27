// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const bodyParser = require("body-parser");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { Translate } = require("@google-cloud/translate").v2;
const speech = require("@google-cloud/speech");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const translate = require("@vitalets/google-translate-api");

// Load environment variables
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID;

if (!GOOGLE_API_KEY) {
    throw new Error("Google API key is not set in environment variables.");
}

// Initialize Google Translate
const googleTranslate = new Translate({ key: GOOGLE_API_KEY });

// Local audio file path (make sure the file is in the same directory)
const LOCAL_FILE_PATH = "test_recording.wav";

// Main endpoint to test local recording
app.get("/test-local-recording", async (req, res) => {
    const selectedLanguage = req.query.language || "en"; // Default to English

    console.log(`Testing local recording with language: ${selectedLanguage}`);

    // Check if file exists
    if (!fs.existsSync(LOCAL_FILE_PATH)) {
        res.status(404).send(`File not found: ${LOCAL_FILE_PATH}`);
        console.error(`File not found: ${LOCAL_FILE_PATH}`);
        return;
    }

    try {
        // Transcribe the local audio file
        const transcriptionText = await transcribeAudio(LOCAL_FILE_PATH, selectedLanguage);

        if (!transcriptionText) {
            res.status(500).send("Transcription failed");
            console.error("Transcription failed.");
            return;
        }

        console.log(`Transcription: ${transcriptionText}`);

        // Translate to English if needed
        let translatedText = transcriptionText;
        if (selectedLanguage !== "en") {
            translatedText = await translateToEnglish(transcriptionText, selectedLanguage);
            console.log(`Translated text: ${translatedText}`);
        }

        // Analyze the transcription using Generative AI
        const genaiResults = await extractInfoAndAnalyze(translatedText);
        console.log("Generative AI Analysis Results:", genaiResults);

        res.send({
            transcription: transcriptionText,
            translatedText: translatedText,
            analysis: genaiResults,
        });
    } catch (error) {
        console.error("Error processing local recording:", error);
        res.status(500).send("Error processing local recording.");
    }
});

// Transcribe the audio file using Google Cloud Speech-to-Text
async function transcribeAudio(fileName, language) {
    const client = new speech.SpeechClient();

    const file = fs.readFileSync(fileName);
    const audioBytes = file.toString("base64");

    const audio = {
        content: audioBytes,
    };

    const config = {
        encoding: "LINEAR16",
        sampleRateHertz: 8000,
        languageCode: getLanguageCode(language),
        useEnhanced: true, // Use enhanced model for better accuracy
        audioChannelCount: 1, // Mono audio from phone calls
    };

    const request = {
        audio: audio,
        config: config,
    };

    try {
        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join("\n");
        console.log(`Transcription completed: ${transcription}`);
        return transcription;
    } catch (error) {
        console.error("Error during transcription:", error);
        return null;
    }
}

// Translate text to English using @vitalets/google-translate-api
async function translateToEnglish(text, language) {
    try {
        const result = await translate(text, { from: language, to: 'en' });
        console.log(`Translation from ${language} to English: ${result.text}`);
        return result.text;
    } catch (error) {
        console.error(`Error with translation using @vitalets/google-translate-api: ${error}`);
        return null;
    }
}

// Extract information using Google AI and analyze
async function extractInfoAndAnalyze(text) {
    const prompt = `
    Given the following text:

    "${text}"

    1. Identify and extract all names (e.g., persons).
    2. Identify and extract all addresses or places.
    3. Analyze the sentiment and tell if the text mentions any disasters like fire, earthquake, crime, floods, etc.
    4. Return the extracted names, addresses, and the disaster/issue in JSON format.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log("Generative AI Response:", response);
        return response.text();
    } catch (error) {
        console.error(`Error with Generative AI API: ${error}`);
        return null;
    }
}

// Helper function to get Google Speech-to-Text language codes
function getLanguageCode(language) {
    switch (language) {
        case "en":
            return "en-US";
        case "hi":
            return "hi-IN";
        case "bn":
            return "bn-IN";
        default:
            return "en-US";
    }
}

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
