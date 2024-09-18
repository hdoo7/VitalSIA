export default class TextToListener {
    constructor(triggerPhrases, bufferTime = 1000) {
        this.triggerPhrases = triggerPhrases.map(phrase => phrase.toLowerCase().trim());
        this.bufferTime = bufferTime;
        this.debounceTimer = null;
        this.utteranceQueue = []; // Queue to accumulate the latest utterances
    }

    // Check if any trigger phrase is detected in the text
    async detectKeyPhrase(text) {
        const lowerText = text.toLowerCase().trim();
        const detectedPhrase = this.triggerPhrases.find(phrase => lowerText.includes(phrase));
        return detectedPhrase || null;
    }

    // Process the text to detect phrases or follow-ups, allowing subclasses to extend it
    async processText(text, waitForFollowUp = false) {
        return new Promise((resolve) => {
            if (this.debounceTimer) clearTimeout(this.debounceTimer);

            this.debounceTimer = setTimeout(async () => {
                const detected = await this.detectKeyPhrase(text);
                if (detected && !waitForFollowUp) {
                    console.log(`Detected trigger phrase: ${detected}`);
                    resolve({ type: 'trigger', phrase: detected });
                } else if (detected && waitForFollowUp) {
                    console.log(`Detected phrase with follow-up: ${detected}`);
                    resolve({ type: 'trigger-with-follow-up', phrase: detected });
                } else {
                    resolve(null);
                }
            }, this.bufferTime);
        });
    }

    // Start listening to the transcribed text using callback instead of generator
    startListening(onTranscribedTextCallback, onRecognizedCallback) {
        console.log('Starting to listen...');
        onTranscribedTextCallback((text) => {
            this.utteranceQueue.push(text); // Add new text to the queue
            if (this.utteranceQueue.length > 0) {
                const latestUtterance = this.utteranceQueue[this.utteranceQueue.length - 1]; // Get the latest utterance

                this.processText(latestUtterance)
                    .then((result) => {
                        if (result) {
                            console.log(`Processing detected phrase: ${result.phrase}`);
                            this.clearUtteranceQueue(); // Clear the queue after processing the latest utterance
                            onRecognizedCallback(result);
                        }
                    })
                    .catch(error => {
                        console.error('Error processing text:', error);
                    });
            }
        });
    }

    // Clear the accumulated utterances after processing
    clearUtteranceQueue() {
        this.utteranceQueue = [];
    }

    stopListening() {
        console.log('Stopped listening.');
    }

    resumeListeningAfterResponse(callback) {
        console.log('Resuming listening...');
        this.startListening(callback);
    }
}