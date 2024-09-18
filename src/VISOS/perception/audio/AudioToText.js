export default class AudioToText {
    constructor(recognitionType = 'webspeech') {
        this.recognition = null;
        this.isRecognizing = false;
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

        this.recognition.onerror = (event) => {
            console.error("Recognition error:", event.error);
            this.stopRecognition(); // Stop recognition on error
        };

        this.recognition.onend = () => {
            console.log("Speech recognition ended.");
            this.isRecognizing = false; // Reset the flag when recognition ends
        };

        this.recognition.start(); // Start recognition
        console.log("Speech recognition started.");
    }

    // Stop recognition if it is running
    stopRecognition() {
        if (this.isRecognizing) {
            this.recognition.stop();
            console.log("Speech recognition stopped.");
            this.isRecognizing = false;
        }
    }
}