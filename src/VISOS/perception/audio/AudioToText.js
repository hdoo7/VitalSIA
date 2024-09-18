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
            // Stop recognition if it is already running and wait for it to stop
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
            } else {
                console.error("Recognition error:", event.error);
            }
            this.stopRecognition(); // Stop recognition on error
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