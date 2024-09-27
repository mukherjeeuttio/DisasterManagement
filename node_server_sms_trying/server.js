// Import required modules
const express = require("express");
const connectDB = require("./config/db.js");
const User = require("./model/userModel.js")
const dotenv = require("dotenv");
const axios = require("axios");
const bodyParser = require("body-parser");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const speech = require("@google-cloud/speech");
const twilio = require("twilio");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { translate } = require("@vitalets/google-translate-api");
const { FleetContextImpl } = require("twilio/lib/rest/preview/deployed_devices/fleet.js");

dotenv.config();
connectDB();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !GOOGLE_API_KEY) {
    throw new Error("One or more API keys not set in environment variables.");
}

const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Store recordings and transcriptions
const recordings = {};
const transcriptions = {};

// Endpoint to handle initial call and language selection
app.post("/voice", (req, res) => {
    const response = new twilio.twiml.VoiceResponse();
    console.log("Incoming Request Body:", req.body);
    const gather = response.gather({ numDigits: 1, action: "/language-selection", method: "POST" });
    gather.say("For English, press 1. Banglay Shunte hole 2 tipun. Hindi mein sunne ke liye 3 dabaye.");
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

    console.log("Incoming Request Body:", req.body); // Log incoming request
    const userPhoneNumber = req.body.From;;
    console.log(`User's phone number from the incoming request: ${userPhoneNumber}`);

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

        // Store the extracted info in MongoDB
        const userData = {
            name: genaiResults.names ? genaiResults.names.join(", ") : null, // Join names if multiple
            phone: userPhoneNumber,
            address: genaiResults.addresses ? genaiResults.addresses.join(", ") : null, // Join addresses if multiple
            issue: genaiResults.issue || "N/A", // Default if no issue found
            time: new Date(), // Current time
            priority: "Medium", // Default priority
            status: "Ongoing", // Default status
            transcribed_text: transcriptionText,
            audio: recordingUrl, // Store the recording URL or file name
            location: {
                latitude: null, // Set this when you have the user's location
                longitude: null  // Set this when you have the user's location
            },
            team_assigned: "team_1", // Default team
        };

        // Save the new user data to the database
        const user = new User(userData);
        try {
            await user.save();
            console.log("User data saved successfully:", userData);
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    } else {
        console.log("Generative AI analysis failed.");
    }

    // Sending SMS with location link
    const ngrokUrl = 'https://ced0-136-233-9-98.ngrok-free.app';
    const locationLink = `${ngrokUrl}/get-location?callSid=${callSid}&userPhoneNumber=${userPhoneNumber}`;
    await sendSmsWithLocationLink(userPhoneNumber, locationLink);

    fs.unlinkSync(fileName);
    console.log(`Deleted temporary file: ${fileName}`);

    res.send("Call recorded, transcribed, and analyzed successfully.");
});


// Function to send SMS with the location link
async function sendSmsWithLocationLink(userPhoneNumber, locationLink) {
    try {
        const message = await client.messages.create({
            body: `Please click the link to share your location: ${locationLink}`,
            to: userPhoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER,
        });
        console.log(`SMS sent successfully: ${message.sid}`);
    } catch (error) {
        console.error("Error sending SMS:", error);
    }
}



async function downloadRecording(recordingUrl, callSid) {
    const maxRetries = 5; // Maximum number of retries
    const waitTime = 2000; // Wait time in milliseconds (2 seconds)

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            console.log(`Attempting to download recording: ${recordingUrl}, Attempt: ${attempt + 1}`);
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
            return fileName;
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed to download recording:`, error);
        }
    }

    console.error("Max retries reached. Unable to download the recording.");
    return null;
}

// Transcribe the audio file using Google Cloud Speech-to-Text
async function transcribeAudio(fileName, language) {
    console.log(`Starting transcription for file: ${fileName} with language: ${language}`);
    const client = new speech.SpeechClient();

    try {
        console.log("Reading file...");
        const file = fs.readFileSync(fileName);
        console.log(`File read successfully. File size: ${file.length} bytes`);

        console.log("Converting file to base64...");
        const audioBytes = file.toString("base64");
        console.log(`File converted to base64. Length: ${audioBytes.length} characters`);

        const audio = {
            content: audioBytes,
        };

        const config = {
            encoding: "LINEAR16",
            sampleRateHertz: 8000,
            languageCode: getLanguageCode(language),
            useEnhanced: true,
            audioChannelCount: 1,
        };

        const request = {
            audio: audio,
            config: config,
        };

        console.log("Sending request to Google Cloud Speech-to-Text API...");
        const [response] = await client.recognize(request);
        console.log("Received response from Google Cloud Speech-to-Text API");

        if (!response.results || response.results.length === 0) {
            console.error("No transcription results returned from the API");
            return null;
        }

        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join("\n");
        console.log(`Transcription completed. Length: ${transcription.length} characters`);
        return transcription;
    } catch (error) {
        console.error("Error during transcription:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
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
            return "bn-IN";
        default:
            return "en-US";
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
   Given the following transcribed text:

    "${text}"

    1. Identify and extract all names (e.g., persons involved).
    2. Identify and extract all addresses or places mentioned in the text.
    3. Identify the disaster or issue being described (e.g., fire, earthquake, robbery, flood, etc.).
    4. Based on the nature of the disaster or issue, assign a priority level to the incident:
        - Critical: Life-threatening emergencies or widespread disasters (e.g., fire in a hospital, earthquake, building collapse).
        - High: Severe issues that require immediate attention (e.g., robbery with violence, severe floods, dangerous accident).
        - Medium: Significant issues but not life-threatening (e.g., minor car accident, local power outage).
        - Low: Non-emergency situations or minor issues (e.g., noise complaints, minor injuries).
    5. Return the extracted names, addresses, the issue, and the assigned priority in the following JSON format:

    {{
        "Name": <Extracted Names>,
        "Address": <Extracted Address>,
        "Issue": <Extracted Issue>,
        "Priority": <Assigned Priority>
    }}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error(`Error with Generative AI API: ${error}`);
        return null;
    }
}

// Endpoint to capture user location
app.get("/get-location", async (req, res) => {
    console.log("Full Request Query:", req.query);
    const callSid = req.query.callSid;
    console.log(callSid);
    const userPhoneNumber = req.query.userPhoneNumber;
    const location = await getUserLocation();
    console.log(userPhoneNumber);
    const updatedUserPhoneNumber = "+" + userPhoneNumber.trim();
    console.log(updatedUserPhoneNumber);
    if (location) {
        console.log("User's location captured:", location);
        console.log("Latitude:", location.location.lat);
        // Update the user record with the latitude and longitude
        await User.updateMany(
            { phone: updatedUserPhoneNumber }, // Find the user by phone number or unique identifier
            {
                $set: {
                    "location.latitude": location.location.lat,
                    "location.longitude": location.location.lng,
                },
            }
        );
        res.send(`Thank you for sharing your location. Latitude: ${location.location.lat}, Longitude: ${location.location.lng}`);
    } else {
        res.status(500).send("Failed to retrieve location.");
    }
});


async function getUserLocation() {
    try {
        const response = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.GOOGLE_MAP_API_KEY}`, {});
        return response.data; // Return the location data
    } catch (error) {
        console.error("Error getting user location:", error);
        return null; // Handle the error gracefully
    }
}

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});