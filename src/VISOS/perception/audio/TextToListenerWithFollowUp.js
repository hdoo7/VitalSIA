import ContinuousTextListener from './ContinuousTextListener';
import TextToListener from './TextToListener';

export default class TextToListenerWithFollowUp extends TextToListener {
    constructor(triggerPhrases, bufferTime = 1000, audioToText) {
        super(triggerPhrases, bufferTime);
        this.audioToText = audioToText;
        this.continuousListener = new ContinuousTextListener(triggerPhrases, bufferTime, true);
    }

    async startListening(callback) {
        try {
            const textStreamGenerator = this.audioToText.startRecognition(); // Start recognition and get the text stream
            this.continuousListener.startContinuousListening(textStreamGenerator)
                .then(async (text) => {
                    const result = await this.processDetectedPhrase(text);
                    callback(result);  // Pass the result back to the chat module
                });
        } catch (error) {
            console.error('Error starting continuous listening:', error);
        }
    }

    async processDetectedPhrase(text) {
        const detectedPhrase = await this.continuousListener.detectKeyPhrase(text);
        
        if (detectedPhrase) {
            console.log(`Detected trigger phrase: ${detectedPhrase}`);
            
            // Check if there is follow-up text
            const followUpText = text.trim().replace(detectedPhrase, '').trim();
            if (followUpText) {
                console.log(`Detected follow-up text: ${followUpText}`);
                return { type: 'follow-up', phrase: followUpText };
            } else {
                console.log("No follow-up text detected after trigger phrase.");
                return { type: 'trigger-with-no-follow-up', phrase: detectedPhrase };
            }
        } else {
            console.log(`Detected follow-up: ${text}`);
            return { type: 'follow-up', phrase: text };
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