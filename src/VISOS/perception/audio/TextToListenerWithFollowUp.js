// TextToListenerWithFollowUp.js
import TextToListener from './TextToListener';

export default class TextToListenerWithFollowUp extends TextToListener {
  constructor(phrases) {
    super(phrases); // Use the parent class constructor
    this.awaitingFollowUp = false;
  }

  listenForFollowUp(text) {
    return new Promise((resolve, reject) => {
      if (this.awaitingFollowUp) {
        this.awaitingFollowUp = false;
        resolve({ phrase: this.lastDetectedPhrase, followUp: text });
        this.lastDetectedPhrase = null; // Clear the last detected phrase
      } else {
        super.listen(text).then(detectedPhrase => {
          if (detectedPhrase) {
            this.awaitingFollowUp = true;
            resolve({ phrase: detectedPhrase, followUp: null });
          } else {
            resolve(null); // No trigger detected
          }
        }).catch(error => reject(error));
      }
    });
  }
}