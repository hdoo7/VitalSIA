import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

export default class AudioToText {
    constructor(engine = 'webspeech', apiKey = '', region = 'eastus') {
        this.engine = engine;
        this.apiKey = apiKey;
        this.region = region;

        if (this.engine === 'microsoft') {
            this.speechConfig = SpeechSDK.SpeechConfig.fromSubscription(this.apiKey, this.region);
            this.speechRecognizer = null;
        } else {
            // Web Speech API setup
            this.recognition = null;
            this.isListening = false;
        }
    }

    initializeRecognizer() {
        if (this.engine === 'microsoft') {
            const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
            this.speechRecognizer = new SpeechSDK.SpeechRecognizer(this.speechConfig, audioConfig);
        
            return new Promise((resolve, reject) => {
                this.speechRecognizer.startContinuousRecognitionAsync(() => {
                    console.log("Continuous recognition started (MS TTS)");
                    resolve();
                }, (error) => {
                    console.error("Failed to start continuous recognition:", error);
                    reject(error);
                });
            });
        } else {
            // Web Speech API initialization
            if (!('webkitSpeechRecognition' in window)) {
                console.error('Web Speech API not supported in this browser.');
                return Promise.reject('Web Speech API not supported');
            }

            this.recognition = new window.webkitSpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US'; // You can customize this

            return Promise.resolve();
        }
    }

    startContinuousRecognition(onRecognizedCallback) {
        if (this.engine === 'microsoft') {
            return new Promise((resolve, reject) => {
                this.initializeRecognizer().then(() => {
                    let accumulatedText = ''; // Store the entire transcription
                    
                    // Handle intermediate recognition results
                    this.speechRecognizer.recognizing = (s, e) => {
                        console.log(`RECOGNIZING: Text=${e.result.text}`);
                    };
        
                    // Handle final recognition results
                    this.speechRecognizer.recognized = (s, e) => {
                        if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                            accumulatedText += ` ${e.result.text}`;
                            console.log(`RECOGNIZED (MS TTS): Text=${accumulatedText}`);
                            if (onRecognizedCallback) {
                                onRecognizedCallback(accumulatedText.trim()); // Pass the full recognized text
                            }
                        } else if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
                            console.log("NOMATCH: Speech could not be recognized.");
                        }
                    };
        
                    this.speechRecognizer.canceled = (s, e) => {
                        console.log(`CANCELED: Reason=${e.reason}`);
                        if (e.reason === SpeechSDK.CancellationReason.Error) {
                            console.log(`CANCELED: ErrorCode=${e.errorCode}`);
                            console.log(`CANCELED: ErrorDetails=${e.errorDetails}`);
                            this.speechRecognizer.stopContinuousRecognitionAsync();
                            reject(e.errorDetails); // Reject the promise with error details
                        }
                    };
                }).catch(error => {
                    console.error("Error initializing recognizer:", error);
                    reject(error);
                });
            });
        } else {
            // Web Speech API
            return new Promise((resolve, reject) => {
                this.initializeRecognizer().then(() => {
                    this.recognition.onresult = (event) => {
                        const transcript = Array.from(event.results)
                            .map(result => result[0].transcript)
                            .join('');
                        console.log(`RECOGNIZED (Web Speech API): ${transcript}`);
                        if (onRecognizedCallback) {
                            onRecognizedCallback(transcript.trim());
                        }
                    };

                    this.recognition.onerror = (event) => {
                        console.error('Speech recognition error:', event.error);
                        reject(event.error);
                    };

                    this.recognition.onend = () => {
                        if (this.isListening) {
                            this.recognition.start(); // Restart if stopped
                        }
                    };

                    this.isListening = true;
                    this.recognition.start();
                    console.log("Continuous recognition started (Web Speech API)");
                    resolve();
                }).catch(error => {
                    console.error("Error initializing Web Speech API:", error);
                    reject(error);
                });
            });
        }
    }

    stopRecognition() {
        if (this.engine === 'microsoft') {
            if (this.speechRecognizer) {
                this.speechRecognizer.stopContinuousRecognitionAsync(() => {
                    console.log("Recognition stopped (MS TTS).");
                }, error => {
                    console.error("Failed to stop recognition:", error);
                });
            }
        } else {
            if (this.recognition) {
                this.isListening = false;
                this.recognition.stop();
                console.log("Recognition stopped (Web Speech API).");
            }
        }
    }
}