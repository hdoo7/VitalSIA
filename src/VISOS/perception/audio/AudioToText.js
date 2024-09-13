export default class AudioToText {
    constructor() {
        this.recognition = null;
        this.isListening = false;
    }

    initializeRecognizer() {
        if (!('webkitSpeechRecognition' in window)) {
            console.error('Web Speech API not supported in this browser.');
            return Promise.reject('Web Speech API not supported');
        }

        this.recognition = new window.webkitSpeechRecognition();
        this.recognition.continuous = true;  // Continuous listening mode
        this.recognition.interimResults = false;  // Final results only
        this.recognition.lang = 'en-US';  // Set language

        return Promise.resolve();
    }

    startContinuousRecognition(onRecognizedCallback) {
        if (this.isListening) {
            console.warn('Recognition is already running.');
            return;
        }

        return new Promise((resolve, reject) => {
            this.initializeRecognizer().then(() => {
                this.recognition.onresult = (event) => {
                    const transcript = Array.from(event.results)
                        .map(result => result[0].transcript)
                        .join('');
                    console.log(`RECOGNIZED: ${transcript.trim()}`);
                    onRecognizedCallback(transcript.trim());
                };

                this.recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    // Handle specific error types
                    if (event.error === 'no-speech') {
                        console.warn('No speech detected, resuming listening...');
                        setTimeout(() => {
                            this.recognition.start(); // Restart recognition after a short delay
                        }, 1000); // Adjust delay as necessary
                    } else {
                        reject(event.error);
                    }
                };

                this.recognition.onend = () => {
                    console.log('Speech recognition ended, restarting...');
                    if (this.isListening) {
                        this.recognition.start(); // Restart if recognition stops
                    }
                };

                this.isListening = true;
                this.recognition.start();
                resolve();
            }).catch(error => {
                console.error('Error initializing speech recognition:', error);
                reject(error);
            });
        });
    }

    stopRecognition() {
        if (this.recognition) {
            this.isListening = false;
            this.recognition.stop();
            console.log('Recognition stopped.');
        }
    }
}