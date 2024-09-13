import TextToListener from './TextToListener';

export default class TextToListenerWithFollowUp extends TextToListener {
    constructor(triggerPhrases, bufferTime = 1000, audioToText) {
        super(triggerPhrases);
        this.awaitingFollowUp = false;
        this.lastDetectedPhrase = null;
        this.audioToText = audioToText;  // Pass the AudioToText instance
        this.debounceTimer = null;
        this.bufferTime = bufferTime;  // Buffer time to debounce follow-up detection
    }

    startListening(onRecognizedCallback) {
        this.audioToText.startContinuousRecognition(onRecognizedCallback);
    }

    stopListening() {
        this.audioToText.stopRecognition();
    }

    // Handle the incoming utterances as a stream
    listenForStream(text) {
        return new Promise((resolve) => {
            if (this.awaitingFollowUp) {
                this.awaitingFollowUp = false;
                resolve({ phrase: this.lastDetectedPhrase, followUp: text });
                this.lastDetectedPhrase = null;
            } else {
                super.listen(text)
                    .then(detectedPhrase => {
                        if (detectedPhrase) {
                            this.awaitingFollowUp = true;
                            this.lastDetectedPhrase = detectedPhrase;
                            resolve({ phrase: detectedPhrase, followUp: null });
                        } else {
                            resolve(null);
                        }
                    });
            }
        });
    }

    // Add the resumeListeningAfterResponse method
    resumeListeningAfterResponse(setStatus, onRecognizedCallback) {
        setTimeout(() => {
            setStatus('listening');  // Update the UI to show that it's listening
            this.startListening(onRecognizedCallback);  // Resume listening
        }, this.bufferTime);  // Resume listening after the specified buffer time
    }

    // Handle long responses by splitting them into smaller utterances
    processUtterance(utterance) {
        const maxLength = 120;  // Define the max length for each chunk
        const utteranceChunks = [];
        let currentChunk = '';

        utterance.split(' ').forEach(word => {
            if (currentChunk.length + word.length + 1 > maxLength) {
                utteranceChunks.push(currentChunk);
                currentChunk = word;
            } else {
                currentChunk += (currentChunk.length === 0 ? '' : ' ') + word;
            }
        });

        if (currentChunk.length > 0) {
            utteranceChunks.push(currentChunk);
        }

        return utteranceChunks;
    }
}