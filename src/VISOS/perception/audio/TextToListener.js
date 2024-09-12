export default class TextToListener {
  constructor(phrases) {
      if (Array.isArray(phrases)) {
          this.phrases = phrases.join(' '); // Convert the array of phrases into a single string
      } else if (typeof phrases === 'string') {
          this.phrases = phrases;
      } else {
          throw new Error('Phrases must be either a string or an array of strings');
      }
      this.lastDetectedPhrase = null;
  }

  listen(text) {
      return new Promise((resolve) => {
          const detectedPhrase = this.detectTriggerPhrase(text);
          if (detectedPhrase) {
              this.lastDetectedPhrase = detectedPhrase;
              resolve(detectedPhrase);
          } else {
              resolve(null);
          }
      });
  }

  detectTriggerPhrase(text) {
      return this.phrases.includes(text.toLowerCase()) ? text : null;
  }
}