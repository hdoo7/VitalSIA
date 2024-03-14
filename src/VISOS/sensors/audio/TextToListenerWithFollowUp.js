import TextToListener from './TextToListener'

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
                        // Resolve with null to indicate awaiting follow-up. This can be optional based on how you wish to handle flow.
                        resolve(null); 
                    } else {
                        // No key phrase detected and not waiting for follow-up.
                        // This could also resolve with null or could reject based on your error handling preference.
                        resolve(null); 
                    }
                }).catch(error => {
                    reject(error); // Propagate errors from the listen method
                });
            }
        });
    }
}

