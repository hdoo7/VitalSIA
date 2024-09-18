export default class ConversationManager {
    constructor(bufferTime = 1000, audioToText) {
        this.audioToText = audioToText;  // Pass the AudioToText instance
        this.bufferTime = bufferTime;    // Buffer time to debounce follow-up detection
    }

    // Start listening and handle the incoming utterances as a stream
    startListening(onRecognizedCallback) {
        console.log("Starting listening session...");
        this.audioToText.startContinuousRecognition((text) => {
            this.processTextStream(text).then(onRecognizedCallback);
        });
    }

    stopListening() {
        this.audioToText.stopRecognition();
    }

    // Process the detected utterances as a simple stream of text
    async processTextStream(text) {
        return new Promise((resolve) => {
            console.log(`Detected phrase: ${text}`);
            resolve(text);  // Simply resolve with the detected text
        });
    }

    // Resume listening after a response with a delay (debounce)
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