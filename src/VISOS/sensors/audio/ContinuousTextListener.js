export default class ContinuousTextListener {
    constructor(phrases = [], bufferTime = 1000, waitForFollowUp = true) {
        this.phrases = phrases.map(phrase => phrase.toLowerCase().trim());
        this.bufferTime = bufferTime;
        this.waitForFollowUp = waitForFollowUp; // Determines if we wait for a follow-up after a phrase is detected
        this.debounceTimer = null;
        this.listeningForAny = phrases.length === 0; // Listen for any utterance if no phrases specified
    }

    async detectKeyPhrase(text) {
        // Immediate return for non-empty text when listening for any utterance
        if (this.listeningForAny && text.trim() !== "") {
            return true;
        }
        const lowerText = text.toLowerCase().trim();
        // Check if any of the specified phrases is included in the input text
        const detectedPhrase = this.phrases.find(phrase => lowerText.includes(phrase));
        return !!detectedPhrase;
    }

    processText(text) {
        return new Promise(resolve => {
            if (this.debounceTimer) clearTimeout(this.debounceTimer);

            this.debounceTimer = setTimeout(async () => {
                const detected = await this.detectKeyPhrase(text);
                if (detected && !this.waitForFollowUp) {
                    console.log(`Detected phrase and returning immediately: ${text}`);
                    resolve(text); // Resolves with the text if a phrase is detected and not waiting for follow-up
                } else if (detected) {
                    console.log(`Detected phrase: ${text}`);
                    // No further action here, but since a phrase was detected, could be a place to set up for the next step
                    resolve(null); // Resolves with null to indicate waiting for further input
                } else {
                    // If no phrase was detected, resolve with null immediately
                    resolve(null);
                }
            }, this.bufferTime);
        });
    }

    async startContinuousListening(textStreamGenerator) {
        for await (const text of textStreamGenerator) {
            const result = await this.processText(text);
            if (result !== null) {
                // Additional processing can be done here with the result
                // This block will only execute if waitForFollowUp is false and a phrase was detected
                console.log(`Processing result: ${result}`);
            }
        }
    }
}
