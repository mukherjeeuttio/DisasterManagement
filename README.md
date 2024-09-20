This is a prototype of the project "Disaster Management using Generative AI"

-To run this prototype in your local machine clone this repository.
-cd DisasterManagement (terminal)
-run the app.py file using the command "python app.py"
-Go to the folder 'ngrok-v3-stable-windows-amd64' and run the ngrok.exe file inside it
-to start a local server type ngrok http 5000
-a new server will be started at localhost:5000
-Copy the Fowarding link provided in the ngrok server window and add '/voice' after it
-This will route the incoming webhook to the voice() method of the flask app
-Paste the link with the /voice route to the Webhook URL of the twilio console of your active number
-Save and continue on twilio
-Make sure to add your account SID and auth token in the app.py program
-Call on your active number which will tell you to describe your emergency
-After the beep describe your emergency and cut the call
-The program will download the recording, transcribe the text and delete the recording from local machine
-the transcription will be available in the terminal along with Z-score matching different disaster types
