import { SpeechConfig, SpeechSynthesizer } from "microsoft-cognitiveservices-speech-sdk";

class SpeechManager {
    constructor(animationManager) {
        this.animationManager = animationManager; // Instance of AnimationManager for viseme application
        this.queue = []; // Queue to hold texts for speech synthesis
        this.isSpeaking = false; // Flag to indicate if speech synthesis is currently happening

        const apiKey = '035bcb3e4d914bccb05ffa9e4f38ae3e';
        const region = 'eastus';
        this.speechConfig = SpeechConfig.fromSubscription(apiKey, region);
        this.speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural"; // Use a specific voice
        this.synthesizer = new SpeechSynthesizer(this.speechConfig);

        // Setup event handler for viseme received
        this.synthesizer.visemeReceived = (s, e) => {
            this.scheduleVisemeApplication(e.visemeId, e.audioOffset);
        };
    }

    enqueueText(text) {
        this.queue.push(text);
        if (!this.isSpeaking) {
            this.processQueue();
        }
    }

    processQueue() {
        if (this.queue.length === 0) {
            this.isSpeaking = false;
            return;
        }

        this.isSpeaking = true;
        const text = this.queue.shift(); // Get the next text to synthesize
        this.synthesizeSpeech(text).then(() => this.processQueue()); // Process the next item in the queue after current speech is done
    }

    synthesizeSpeech(text) {
        return new Promise((resolve, reject) => {
            this.synthesizer.speakTextAsync(text,
                result => {
                    console.log("Speech synthesis completed.");
                    resolve(result);
                },
                error => {
                    console.error("Error during speech synthesis:", error);
                    reject(error);
                });
        });
    }

    scheduleVisemeApplication(visemeId, audioOffset) {
        setTimeout(() => {
            this.applyVisemeToCharacter(visemeId);
        }, audioOffset / 10066); // Convert the offset to milliseconds if necessary
    }

    applyVisemeToCharacter(visemeId) {
        const facsLib = this.animationManager.facsLib; // Access facsLib from the AnimationManager instance

        if (visemeId === 0) {
            // facsLib.setNeutral(1.0);
            facsLib.setNeutralViseme(0.0);
        } else {
            visemeId -= 1; // Adjust if your viseme IDs need alignment with your animation system
            facsLib.setTargetViseme(visemeId, 70, 0); // Apply the viseme
        }

        facsLib.updateEngine(); // Update the engine to reflect the new viseme
    }
}

export default SpeechManager;
