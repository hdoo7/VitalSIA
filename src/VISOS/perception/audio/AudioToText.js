export default class AudioToText {
    constructor(recognitionType = 'webspeech') {
        this.recognition = null;
        this.isRecognizing = false;
        this.isManuallyStopped = false; // New flag to track manual stopping
        this.initRecognition(recognitionType);
    }

    initRecognition(recognitionType) {
        if (recognitionType === 'webspeech') {
            this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            this.recognition.interimResults = false;
            this.recognition.continuous = true;
            this.recognition.lang = 'en-US';
        } else {
            console.error("Unsupported recognition type");
        }
    }

    // Start recognition, but first stop any existing recognition
    startContinuousRecognition(onRecognizedCallback) {
        if (this.isRecognizing) {
            // Recognition is already running, so stop it first
            this.recognition.onend = () => {
                this.isRecognizing = false;
                this.startRecognitionProcess(onRecognizedCallback); // Start the recognition after stopping
            };
            this.stopRecognition();
        } else {
            // Start recognition directly if it is not already running
            this.isManuallyStopped = false; // Reset manual stop flag
            this.startRecognitionProcess(onRecognizedCallback);
        }
    }

    // Process for starting recognition
    startRecognitionProcess(onRecognizedCallback) {
        if (this.isRecognizing) {
            console.warn("Recognition is already running, skipping start.");
            return; // Avoid starting if it's already running
        }

        this.isRecognizing = true;
        const finalTranscript = [];

        this.recognition.onresult = (event) => {
            const results = event.results;
            for (let i = event.resultIndex; i < results.length; i++) {
                if (results[i].isFinal) {
                    finalTranscript.push(results[i][0].transcript.trim());
                }
            }
            onRecognizedCallback(finalTranscript.join(' ')); // Send the transcription result
        };

        // Handle recognition errors
        this.recognition.onerror = (event) => {
            if (event.error === 'not-allowed') {
                console.error("Recognition error: Microphone access was not allowed.");
                alert("Please allow microphone access to use the speech recognition feature.");
                this.stopRecognition(); // Stop recognition on permission error
            } else if (event.error === 'no-speech') {
                console.warn("Recognition error: No speech detected.");
                // Automatically restart recognition if it's a no-speech error and not manually stopped
                if (!this.isManuallyStopped) {
                    setTimeout(() => {
                        console.log("Restarting speech recognition after no-speech error...");
                        this.startRecognitionProcess(onRecognizedCallback); // Restart after no-speech error
                    }, 1000); // Add a small delay before restarting
                }
            } else {
                console.error("Recognition error:", event.error);
                this.stopRecognition(); // Stop recognition on other errors
            }
        };

        this.recognition.onend = () => {
            console.log("Speech recognition ended.");
            this.isRecognizing = false; // Reset the flag when recognition ends
            if (!this.isManuallyStopped) {
                console.log("Restarting speech recognition...");
                this.startRecognitionProcess(onRecognizedCallback); // Automatically restart recognition if not manually stopped
            }
        };

        this.recognition.start(); // Start recognition
        console.log("Speech recognition started.");
    }

    // Stop recognition if it is running
    stopRecognition() {
        if (this.isRecognizing) {
            this.isManuallyStopped = true; // Set the manual stop flag
            this.recognition.stop();
            console.log("Speech recognition stopped manually.");
            this.isRecognizing = false;
        }
    }
}