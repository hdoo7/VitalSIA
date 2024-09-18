export default class ConversationManager {
    constructor(bufferTime = 1000, audioToText, voiceManager, wordThreshold = 5) {
        this.bufferTime = bufferTime;
        this.audioToText = audioToText;
        this.voiceManager = voiceManager;  // Now accepts voiceManager
        this.wordThreshold = wordThreshold; // Number of words to trigger interruption
        this.isListening = false;
    }

    // Start listening and handle incoming transcriptions as a promise
    startListening() {
        return new Promise((resolve, reject) => {
            console.log("Starting listening session...");
            this.isListening = true;

            this.audioToText.startContinuousRecognition((transcribedText) => {
                if (this.isListening) {
                    resolve(transcribedText); // Resolve the promise when text is transcribed
                }
            });

            // Handle errors from audioToText if necessary
            this.audioToText.onerror = (error) => {
                console.error("Error during speech recognition:", error);
                reject(error);  // Reject the promise if there's an error
            };
        });
    }

    // Stop listening
    stopListening() {
        console.log("Stopping listening...");
        this.isListening = false;
        this.audioToText.stopRecognition();
    }

    // Enqueue text and handle speaking while controlling listening behavior
    enqueueText(text) {
        return new Promise((resolve, reject) => {
            console.log("Speaking text:", text);
            this.stopListening();  // Stop listening while speaking
            this.voiceManager.enqueueText(text).then(() => {
                console.log("Finished speaking");
                resolve();  // Return promise once speaking is done
                setTimeout(() => {
                    this.resumeListening();  // Resume listening after speaking
                }, this.bufferTime);
            }).catch(error => {
                console.error("Error during speech:", error);
                reject(error);
            });
        });
    }

    // Resume listening after speaking or other action
    resumeListening() {
        console.log("Resuming listening...");
        this.isListening = true;
        this.startListening().then((text) => {
            if (this.detectInterruption(text)) {
                this.handleInterruption(text);
            }
        }).catch((error) => {
            console.error("Error during resuming listening:", error);
        });
    }

    // Detect if the user has spoken more than the word threshold during the agent's speech
    detectInterruption(text) {
        const wordCount = text.split(' ').length;
        return wordCount >= this.wordThreshold;
    }

    // Handle interruption by stopping the agent's speech and returning to listening
    handleInterruption(userText) {
        console.log(`User interruption detected: ${userText}`);
        this.voiceManager.stopSpeech();  // Stop current speech
        this.resumeListening();  // Return to listening immediately
    }

    // Resume listening after a response with a promise-based return
    resumeListeningAfterResponse(setStatus) {
        return new Promise((resolve) => {
            setTimeout(() => {
                setStatus('listening');  // Update status to listening
                this.startListening().then((text) => {
                    resolve(text);  // Resolve with the transcribed text
                });
            }, this.bufferTime);
        });
    }
}