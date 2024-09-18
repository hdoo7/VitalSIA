export default class TextToListener {
    constructor(triggerPhrases, bufferTime = 1000) {
        this.triggerPhrases = triggerPhrases.map(phrase => phrase.toLowerCase().trim());
        this.bufferTime = bufferTime;
        this.debounceTimer = null;
    }

    // Check if any trigger phrase is detected in the text
    async detectKeyPhrase(text) {
        const lowerText = text.toLowerCase().trim();
        const detectedPhrase = this.triggerPhrases.find(phrase => lowerText.includes(phrase));
        return detectedPhrase || null;
    }

    // Process the text to detect phrases or follow-ups, allowing subclasses to extend it
    async processText(text, waitForFollowUp = false) {
        return new Promise(resolve => {
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

    // Start listening to the transcribed text (to be used by subclasses)
    async *startListening(textStreamGenerator) {
        for await (let text of textStreamGenerator) {
            const result = await this.processText(text);
            if (result) {
                console.log(`Processing detected phrase: ${result.phrase}`);
                yield result;
            }
        }
    }

    stopListening() {
        console.log('Stopped listening.');
    }

    resumeListeningAfterResponse(callback) {
        console.log('Resuming listening...');
        this.startListening(callback);
    }
}