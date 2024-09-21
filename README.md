# Disaster Management using Generative AI

This is a prototype for the project **"Disaster Management using Generative AI."**

## Steps to Run the Prototype Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/DisasterManagement.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd DisasterManagement
   ```

3. **Run the Flask application:**
   ```bash
   python app.py
   ```

4. **Set up Ngrok:**
   - Navigate to the folder `ngrok-v3-stable-windows-amd64`.
   - Run the `ngrok.exe` file inside the folder.

5. **Start the Ngrok local server:**
   ```bash
   ngrok http 5000
   ```
   - A new server will start at `localhost:5000`.
   - Copy the forwarding link provided by Ngrok in the terminal window.

6. **Configure the Twilio webhook:**
   - Take the forwarding link from Ngrok and append `/voice` to it.
     ```
     https://<ngrok-forwarding-link>/voice
     ```
   - Go to your Twilio console and paste this link in the **Webhook URL** for your active number.

7. **Save and continue on Twilio:**
   - Make sure to add your **Account SID** and **Auth Token** in the `app.py` program (replace placeholders).

8. **Make a call to your Twilio number:**
   - Call the number, and you'll hear instructions to describe your emergency.
   - After the beep, describe the emergency and end the call.

9. **Recording and Transcription:**
   - The program will:
     - Download the call recording.
     - Transcribe the audio.
     - Delete the recording from the local machine after transcription.

10. **View Transcription and Disaster Type Matching:**
    - The transcription will be printed in the terminal.
    - The Z-score matching different disaster types will also be displayed in the terminal.
