import ContinuousTextListener from './ContinuousTextListener';
import TextToListener from './TextToListener';

export default class TextToListenerWithFollowUp extends TextToListener {
    constructor(triggerPhrases, bufferTime = 1000, audioToText) {
        super(triggerPhrases, bufferTime);
        this.audioToText = audioToText;
        this.continuousListener = new ContinuousTextListener(triggerPhrases, bufferTime, true);
    }

    // Start listening and pass detected phrases to the callback
    async startListening(callback) {
        try {
            const textStreamGenerator = this.audioToText.startRecognition();  // Using the generator for transcribed text
            for await (const text of textStreamGenerator) {
                const result = await this.processText(text, true);  // Process each transcribed text chunk
                if (result) {
                    callback(result);  // Pass the result (if any) to the chat module for further handling
                }
            }
        } catch (error) {
            console.error('Error during continuous listening:', error);
        }
    }

    async processDetectedPhrase(text) {
        const detectedPhrase = await this.continuousListener.detectKeyPhrase(text);
        if (detectedPhrase) {
            console.log(`Detected trigger phrase: ${text}`);
            return text;  // Handle detected trigger phrase
        } else {
            console.log('Waiting for follow-up...');
            return null;  // Continue listening for follow-up
        }
    }

    stopListening() {
        // Stop audio recognition when needed
        this.audioToText.stopRecognition();
        console.log('Stopped listening for input.');
    }

    resumeListeningAfterResponse(callback) {
        console.log('Resuming listening after response...');
        this.startListening(callback);
    }
}