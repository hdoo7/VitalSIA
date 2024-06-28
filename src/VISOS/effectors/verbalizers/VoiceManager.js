import PhonemeExtractor from './PhonemeExtractor';
import VisemeMapper from './VisemeMapper';

export default class VoiceManager {
    constructor(animationManager) {
        this.animationManager = animationManager;
        this.queue = [];
        this.isSpeaking = false;

        // Initialize the Speech Synthesis API
        this.synth = window.speechSynthesis;
        this.voice = this.synth.getVoices().find(voice => voice.name === 'Google US English' || voice.name === 'en-US');

        this.phonemeExtractor = new PhonemeExtractor();
        this.visemeMapper = new VisemeMapper();
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
            const utterThis = new SpeechSynthesisUtterance(text);
            utterThis.voice = this.voice;

            utterThis.onend = () => {
                console.log("Speech synthesis completed.");
                this.animationManager.setVisemeToNeutral(); // Correctly call setVisemeToNeutral
                resolve();
            };

            utterThis.onerror = (e) => {
                console.error("Error during speech synthesis:", e);
                this.animationManager.setVisemeToNeutral(); // Correctly call setVisemeToNeutral
                reject(e);
            };

            utterThis.onboundary = (event) => {
                if (event.name === 'word') {
                    const word = text.substring(event.charIndex, event.charIndex + event.charLength);
                    const phonemes = this.phonemeExtractor.extractPhonemes(word);
                    const visemes = this.visemeMapper.mapPhonemesToVisemes(phonemes);
                    this.applyVisemes(visemes);
                }
            };

            this.synth.speak(utterThis);
        });
    }

    applyVisemes(visemes) {
        let delay = 0;

        visemes.forEach(({ viseme, duration }, i) => {
            if (viseme === 'PAUSE' && i !== visemes.length - 1) {
                delay += duration;
                this.animationManager.applyVisemeChange(0, 1, 0); // Use the interval as the duration for the pause
            } else {
                setTimeout(() => {
                    this.animationManager.applyVisemeChange(viseme, 80, 0);
                }, delay);
                delay += duration; // Use the calculated duration
            }
            if (i === visemes.length - 1) {
                setTimeout(() => {
                    this.animationManager.applyVisemeChange(viseme, 0, 0);
                }, delay);
                // Use the interval as the duration for the pause
            }
        });

        setTimeout(() => {
            this.animationManager.setVisemeToNeutral(); // Reset viseme after speech
        }, delay -300); // Add a slight delay after the last viseme
    }

    stopSpeech() {
        this.queue = [];
        this.isSpeaking = false;
        this.synth.cancel();
        this.animationManager.setVisemeToNeutral(); // Correctly call setVisemeToNeutral
        console.log("Speech synthesis stopped.");
    }

    interruptSpeech(text) {
        this.queue = [];
        this.isSpeaking = false;
        this.synth.cancel();
        this.animationManager.setVisemeToNeutral(); // Correctly call setVisemeToNeutral

        if (text) {
            this.enqueueText(text);
        }

        console.log("Speech synthesis interrupted.");
    }
}