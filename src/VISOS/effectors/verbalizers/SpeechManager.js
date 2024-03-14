import { SpeechConfig, SpeechSynthesizer } from "microsoft-cognitiveservices-speech-sdk";

class SpeechManager {
    static instance = null;

    static getInstance(animationManager) {
        if (!SpeechManager.instance) {
            SpeechManager.instance = new SpeechManager(animationManager);
        }
        return SpeechManager.instance;
    }

    constructor(animationManager) {
        if (SpeechManager.instance) {
            throw new Error("Error: Instantiation failed: Use SpeechManager.getInstance() instead of new.");
        }
        this.animationManager = animationManager;
        this.queue = [];
        this.isSpeaking = false;

        // Initialize synthesizer
        this.initSynthesizer();
    }

    initSynthesizer() {
        const apiKey = '035bcb3e4d914bccb05ffa9e4f38ae3e';
        const region = 'eastus';
        const speechConfig = SpeechConfig.fromSubscription(apiKey, region);
        speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

        this.synthesizer = new SpeechSynthesizer(speechConfig);

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
        const text = this.queue.shift();
        this.synthesizeSpeech(text).then(() => this.processQueue());
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
        const offsetInMilliseconds = audioOffset / 10000;
        setTimeout(() => {
            this.applyVisemeToCharacter(visemeId);
        }, offsetInMilliseconds);
    }

    applyVisemeToCharacter(visemeId) {
        const facsLib = this.animationManager.facsLib;

        if (visemeId === 0) {
            facsLib.setNeutralViseme(0.0);
        } else {
            visemeId -= 1;
            facsLib.setTargetViseme(visemeId, 70, 0);
        }

        facsLib.updateEngine();
    }

    stopSpeech() {
        // Dispose of the current synthesizer to stop speech
        this.synthesizer.close();

        // Clear the queue and reset the speaking state
        this.queue = [];
        this.isSpeaking = false;

        // Reinitialize the synthesizer for future use
        this.initSynthesizer();

        console.log("Speech synthesis stopped.");
    }

    interruptSpeech(text) {
        // Dispose of the current synthesizer to stop speech
        this.synthesizer.close();

        // Clear the queue, reset the speaking state, and reinitialize the synthesizer
        this.queue = [];
        this.isSpeaking = false;
        this.initSynthesizer();

        if (text) {
            this.enqueueText(text); // Enqueue and play the new text
        }

        console.log("Speech synthesis interrupted.");
    }
}

export default SpeechManager;
