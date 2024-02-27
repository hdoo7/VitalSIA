export default class TextToListener {
    constructor(phrases) {
        // Ensure phrases are both lowercased and trimmed to handle edge cases
        this.phrases = Array.isArray(phrases) ? phrases.map(phrase => phrase.toLowerCase().trim()) : [phrases.toLowerCase().trim()];
    }

    listen(text) {
        // Return a promise that resolves if any of the phrases are detected in the text
        return new Promise((resolve, reject) => {
            // Lowercase and trim the incoming text to match the preprocessing of the phrases
            const lowerText = text.toLowerCase().trim();

            // Attempt to find a phrase that matches a portion of the text
            const detectedPhrase = this.phrases.find(phrase => lowerText.includes(phrase));

            if (detectedPhrase) {
                console.log(`Detected phrase: ${detectedPhrase}`);
                resolve(detectedPhrase);
            } else {
                // Instead of rejecting, resolve with null to indicate no match was found
                // This allows for more graceful handling of continuous streams of text
                resolve(null);
            }
        });
    }
}