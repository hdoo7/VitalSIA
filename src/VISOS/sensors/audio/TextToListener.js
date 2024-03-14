export default class TextToListener {
  constructor(phrases, debounceTime = 1000) { // Add a debounceTime parameter with a default value
      this.phrases = Array.isArray(phrases) ? phrases.map(phrase => phrase.toLowerCase().trim()) : [phrases.toLowerCase().trim()];
      this.debounceTime = debounceTime; // Time in milliseconds to wait for the next utterance
      this.timeoutId = null; // To keep track of the debounce timeout
      this.lastDetectedPhrase = null; // To store the last detected phrase
  }

  listen(text) {
      return new Promise((resolve, reject) => {
          const lowerText = text.toLowerCase().trim();
          const detectedPhrase = this.phrases.find(phrase => lowerText.includes(phrase));

          // If a phrase is detected and we're not already waiting for a debounce
          if (detectedPhrase && !this.timeoutId) {
              this.lastDetectedPhrase = detectedPhrase; // Store the detected phrase
              console.log(`Detected phrase: ${detectedPhrase}`);

              // Setup a debounce to wait for the next piece of text
              this.timeoutId = setTimeout(() => {
                  this.timeoutId = null; // Reset the debounce timer
                  if (this.lastDetectedPhrase) {
                      // Resolve with both the detected phrase and the debounce text
                      resolve({ detectedPhrase: this.lastDetectedPhrase, debounceText: lowerText.replace(detectedPhrase, '').trim() });
                      this.lastDetectedPhrase = null; // Reset the last detected phrase
                  }
              }, this.debounceTime);
          } else if (this.timeoutId) {
              // If we're in debounce mode, update the text associated with the last detected phrase
              clearTimeout(this.timeoutId); // Clear the existing timeout
              this.timeoutId = setTimeout(() => {
                  this.timeoutId = null; // Reset the debounce timer
                  if (this.lastDetectedPhrase) {
                      resolve({ detectedPhrase: this.lastDetectedPhrase, debounceText: lowerText });
                      this.lastDetectedPhrase = null; // Reset the last detected phrase
                  }
              }, this.debounceTime);
          } else {
              // If no phrase is detected and not in a debounce period, resolve with null
              resolve(null);
          }
      });
  }
}
