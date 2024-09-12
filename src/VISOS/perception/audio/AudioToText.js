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
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US'; // You can change the language as needed

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
                    reject(event.error);
                };

                this.recognition.onend = () => {
                    if (this.isListening) {
                        this.recognition.start(); // Restart if recognition ends
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