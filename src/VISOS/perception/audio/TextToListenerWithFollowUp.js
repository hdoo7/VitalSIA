import TextToListener from './TextToListener';

export default class TextToListenerWithFollowUp extends TextToListener {
    constructor(triggerPhrases) {
        super(triggerPhrases);
        this.awaitingFollowUp = false;
        this.lastDetectedPhrase = null;
    }

    // Update the class to handle streams of text
    listenForStream(text) {
        return new Promise((resolve, reject) => {
            if (this.awaitingFollowUp) {
                // Handle the follow-up text
                this.awaitingFollowUp = false;
                resolve({ phrase: this.lastDetectedPhrase, followUp: text });
                this.lastDetectedPhrase = null;
            } else {
                // Detect trigger phrases and listen for follow-up
                super.listen(text)
                    .then(detectedPhrase => {
                        if (detectedPhrase) {
                            this.awaitingFollowUp = true;
                            this.lastDetectedPhrase = detectedPhrase;
                            resolve({ phrase: detectedPhrase, followUp: null });
                        } else {
                            resolve(null);
                        }
                    })
                    .catch(error => reject(error));
            }
        });
    }
}