// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const bodyParser = require("body-parser");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { Translate } = require("@google-cloud/translate").v2;
const speech = require("@google-cloud/speech");
const twilio = require("twilio");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const translate = require("@vitalets/google-translate-api");
// Load environment variables
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID; // Optional for speech-to-text

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !GOOGLE_API_KEY) {
    throw new Error("One or more API keys not set in environment variables.");
}

const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Initialize Google Translate
const translate = new Translate({ key: GOOGLE_API_KEY });

// Store recordings and transcriptions
const recordings = {};
const transcriptions = {};

// Endpoint to handle initial call and language selection
app.post("/voice", (req, res) => {
    const response = new twilio.twiml.VoiceResponse();
    const gather = response.gather({ numDigits: 1, action: "/language-selection", method: "POST" });
    gather.say("For English, press 1. Banglay Shunte hole 2 tipun. Hindi mein shunne ke liye 3 dabaye.");
    console.log("Voice response sent for language selection.");
    res.type("text/xml").send(response.toString());
});

// Endpoint to process language selection
app.post("/language-selection", (req, res) => {
    const selectedLanguage = req.body.Digits;
    console.log(`Language selected: ${selectedLanguage}`);

    let language, message;

    if (selectedLanguage == "1") {
        language = "en";
        message = "You selected English. Please describe your situation.";
    } else if (selectedLanguage === "2") {
        language = "bn";
        message = "Aapni Bangla bhasha choyon korechen. Doya Kore Aapnar bortoman Poristhitir biboron din.";
    } else if (selectedLanguage === "3") {
        language = "hi";
        message = "Aapne Hindi chuna hai. Kripya apne paristhiti ka varnan kare.";
    } else {
        res.status(400).send("Invalid selection");
        console.error("Invalid language selection.");
        return;
    }

    const response = new twilio.twiml.VoiceResponse();
    response.say(message);
    console.log(`Response message for language selection: ${message}`);
    response.record({ maxLength: 120, action: `/handle-recording?language=${language}` });
    res.type("text/xml").send(response.toString());
});

// Handle recording and transcriptions
app.post("/handle-recording", async (req, res) => {
    const recordingUrl = req.body.RecordingUrl;
    const callSid = req.body.CallSid;
    const selectedLanguage = req.query.language; // Get language from query parameter

    console.log(`Handling recording for language: ${selectedLanguage}`);

    if (!recordingUrl || !callSid || !selectedLanguage) {
        res.status(400).send("Missing data from Twilio");
        console.error("Missing recording URL, Call SID, or language.");
        return;
    }

    recordings[callSid] = recordingUrl;
    console.log(`Recording available at: ${recordingUrl}`);

    const fileName = await downloadRecording(recordingUrl, callSid);

    if (!fileName) {
        res.status(500).send("Failed to download recording");
        console.error("Failed to download recording.");
        return;
    }

    const transcriptionText = await transcribeAudio(fileName, selectedLanguage);

    if (!transcriptionText) {
        res.status(500).send("Transcription failed");
        console.error("Transcription failed.");
        return;
    }

    transcriptions[callSid] = transcriptionText;
    console.log(`Transcription: ${transcriptionText}`);

    // Translate to English if needed
    let translatedText = transcriptionText;
    if (selectedLanguage !== "en") {
        translatedText = await translateToEnglish(transcriptionText, selectedLanguage);
        console.log(`Translated text: ${translatedText}`);
    }

    const genaiResults = await extractInfoAndAnalyze(translatedText);
    console.log("Generative AI Analysis Results:", genaiResults);

    if (genaiResults) {
        console.log("Generative AI analysis completed successfully.");
    } else {
        console.log("Generative AI analysis failed.");
    }

    fs.unlinkSync(fileName);
    console.log(`Deleted temporary file: ${fileName}`);

    res.send("Call recorded, transcribed, and analyzed successfully.");
});

// Download recording from Twilio with retry logic
async function downloadRecording(recordingUrl, callSid) {
    const maxRetries = 5; // Maximum number of retries
    const waitTime = 2000; // Wait time in milliseconds (10 seconds)

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            console.log(`Attempting to download recording: ${recordingUrl}, Attempt: ${attempt + 1}`);
            // Wait for 10 seconds before each attempt
            await new Promise(resolve => setTimeout(resolve, waitTime));

            const response = await axios.get(recordingUrl, {
                auth: {
                    username: TWILIO_ACCOUNT_SID,
                    password: TWILIO_AUTH_TOKEN,
                },
                responseType: "arraybuffer",
            });

            const fileName = `${callSid}.wav`;
            fs.writeFileSync(fileName, response.data);
            console.log(`Recording downloaded successfully: ${fileName}`);
            return fileName; // Return the file name if successful
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed to download recording:`, error);
        }
    }

    console.error("Max retries reached. Unable to download the recording.");
    return null; // Return null if all attempts fail
}

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
        // model: "phone_call", // This model is better for phone call audio
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

function getLanguageCode(language) {
    switch (language) {
        case "en":
            return "en-US";
        case "hi":
            return "hi-IN";
        case "bn":
            return "bn-IN"; // Changed from "bn-BD" to "bn-IN" for better support
        default:
            return "en-US";
    }
}

// Translate text to English using Google Translate
// Translate text to English using Gemini and analyze
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
    4. Return the extracted names, addresses, and the disaster/issue in json format.
    `;

    try {
        // Initialize the Google AI client

        // For this example, we'll use the gemini-1.5-pro-latest model
        // You may need to adjust this based on the available models

        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log("Generative AI Response:", response);
        return response.text();
    } catch (error) {
        console.error(`Error with Generative AI API: ${error}`);
        return null;
    }
}


// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
