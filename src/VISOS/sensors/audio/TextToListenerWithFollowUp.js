import TextToListener from './TextToListener';

export default class TextToListenerWithFollowUp extends TextToListener {
    constructor(phrases, bufferTime = 1000) {
        super(phrases, bufferTime);
        this.resetFollowUpState();
    }

    resetFollowUpState() {
        this.awaitingFollowUp = false;
        this.lastDetectedPhrase = null;
    }

    processText(text) {
        // Extended to handle text processing and manage follow-up state
        return new Promise((resolve, reject) => {
            super.processText(text).then(detectedPhrase => {
                if (this.awaitingFollowUp) {
                    // If already waiting for a follow-up, resolve with the phrase and follow-up text
                    console.log(`Received follow-up: ${text}`);
                    const result = { phrase: this.lastDetectedPhrase, followUp: text };
                    this.resetFollowUpState();
                    resolve(result);
                } else if (detectedPhrase) {
                    // Detected a new phrase, setup for awaiting follow-up
                    console.log(`Detected phrase: ${detectedPhrase}, awaiting follow-up...`);
                    this.awaitingFollowUp = true;
                    this.lastDetectedPhrase = detectedPhrase;
                    // Do not resolve here, wait for the follow-up
                } else {
                    // No phrase detected and not waiting for follow-up, keep listening
                    console.log(`No key phrase detected in: ${text}`);
                    // Do not resolve here, as we want to keep the process alive for continuous input
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    async startContinuousListening(textStreamGenerator) {
        console.log("Starting continuous listening with follow-up...");
        for await (const text of textStreamGenerator) {
            try {
                const result = await this.processText(text);
                if (result) {
                    console.log(`Processed phrase and follow-up:`, result);
                    // Handle the result
                }
                // The loop continues listening without breaking unless an explicit break condition is met
            } catch (error) {
                console.error("Error during continuous listening:", error);
                break; // Break on error, could also choose to continue depending on desired behavior
            }
        }
    }
}
