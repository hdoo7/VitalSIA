// Import the Speech SDK
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { BaseStreamManager } from './BaseStreamManager';

class StreamAudioToTextProcessor extends BaseStreamManager {
    constructor() {
        super();
        // Hardcoded subscription key and service region
        const apiKey = '77326273c9e74b93a49efc8093c19282';
        console.log("API Key: ", apiKey);
        const region = 'eastus';

        this.speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
        this.speechRecognizer = null;
    }

    async convertStreamToText() {
        await this.getAudioStream(); // Ensure the audio stream is acquired

        return new Promise((resolve, reject) => {
            const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
            this.speechRecognizer = new SpeechSDK.SpeechRecognizer(this.speechConfig, audioConfig);

            this.speechRecognizer.recognizeOnceAsync(result => {
                if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                    console.log(`Recognized text: ${result.text}`);
                    resolve(result.text);
                } else {
                    console.error("Speech recognition failed:", result);
                    reject(result.errorDetails);
                }
            });
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
