import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import BaseStreamManager from './BaseStreamManager';

class StreamAudioToTextProcessor extends BaseStreamManager {
    constructor() {
        super();
        // Placeholder for your API key and region
        const apiKey = 'YOUR_API_KEY';
        const region = 'YOUR_REGION';

        this.speechConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey, region);
        this.speechRecognizer = null;
        this.initializeStream(); // Initiate the stream acquisition
    }

    async initializeStream() {
        try {
            const stream = await this.getAudioStream();
            if (stream) {
                console.log("Audio stream initialized and ready.");
                // Stream is ready; you can now await user action to start transcription
            } else {
                console.error("Failed to initialize audio stream.");
            }
        } catch (error) {
            console.error("Error initializing the audio stream:", error);
        }
    }

    async convertStreamToText() {
        // Ensure the speech recognizer is set up here, as the stream should already be acquired
        if (!this.speechRecognizer) {
            const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
            this.speechRecognizer = new SpeechSDK.SpeechRecognizer(this.speechConfig, audioConfig);
        }

        return new Promise((resolve, reject) => {
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

export default StreamAudioToTextProcessor;
