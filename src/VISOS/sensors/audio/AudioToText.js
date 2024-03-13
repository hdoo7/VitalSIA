// StreamAudioToTextProcessor.js
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import BaseStreamManager from './BaseStreamManager';

export default class AudioToText extends BaseStreamManager {
    constructor() {
        super();
        const apiKey = '035bcb3e4d914bccb05ffa9e4f38ae3e';
        const region = 'eastus';
        this.speechConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey, region);
        this.speechRecognizer = null;
    }

    initializeRecognizer() {
        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        this.speechRecognizer = new SpeechSDK.SpeechRecognizer(this.speechConfig, audioConfig);
    }

    startContinuousRecognition() {
        return new Promise((resolve, reject) => {
            this.initializeRecognizer();
            this.speechRecognizer.startContinuousRecognitionAsync();

            this.speechRecognizer.recognizing = (s, e) => {
                console.log(`RECOGNIZING: Text=${e.result.text}`);
            };

            this.speechRecognizer.recognized = (s, e) => {
                if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                    console.log(`RECOGNIZED: Text=${e.result.text}`);
                    resolve(e.result.text);
                } else if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
                    console.log("NOMATCH: Speech could not be recognized.");
                }
            };

            this.speechRecognizer.canceled = (s, e) => {
                console.log(`CANCELED: Reason=${e.reason}`);
                if (e.reason === SpeechSDK.CancellationReason.Error) {
                    console.log(`CANCELED: ErrorCode=${e.errorCode}`);
                    console.log(`CANCELED: ErrorDetails=${e.errorDetails}`);
                    console.log(`CANCELED: Did you update the subscription info?`);
                    reject(e.errorDetails);
                }
                this.speechRecognizer.stopContinuousRecognitionAsync();
            };
        });
    }

    stopRecognition() {
        if (this.speechRecognizer) {
            this.speechRecognizer.stopContinuousRecognitionAsync(() => {
                console.log("Recognition stopped.");
            }, error => {
                console.error("Failed to stop recognition:", error);
            });
        }
    }
}
