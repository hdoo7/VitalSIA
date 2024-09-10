import TextToListener from './TextToListener';

export default class TextToListenerWithFollowUp extends TextToListener {
    constructor(phrases) {
        super(phrases);
        this.awaitingFollowUp = false;
    }

    listenForFollowUp(text) {
        return new Promise((resolve, reject) => {
            if (this.awaitingFollowUp) {
                // Reset awaitingFollowUp and resolve with both the phrase and text.
                this.awaitingFollowUp = false;
                resolve({ phrase: this.lastDetectedPhrase, followUp: text });
                this.lastDetectedPhrase = null; // Clear the last detected phrase
            } else {
                super.listen(text).then(detectedPhrase => {
                    if (detectedPhrase) {
                        // Detected a key phrase, set to await the next piece of text as follow-up.
                        this.awaitingFollowUp = true;
                        this.lastDetectedPhrase = detectedPhrase; // Store the detected phrase
                        console.log(`Detected phrase: ${detectedPhrase}, awaiting follow-up...`);
                        resolve(null); 
                    } else {
                        console.log("No trigger phrase detected. Listening for follow-up...");
                        resolve(null); 
                    }
                }).catch(error => {
                    reject(error);
                });
            }
        });
    }
}