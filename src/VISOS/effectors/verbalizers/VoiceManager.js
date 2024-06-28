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
                    const phonemes = this.phonemeExtractor.extractPhonemes(event.utterance.text);
                    const visemes = this.visemeMapper.mapPhonemesToVisemes(phonemes);
                    this.applyVisemes(visemes);
                }
            };

            this.synth.speak(utterThis);
        });
    }

    applyVisemes(visemes) {
        let delay = 0;
        const visemeInterval = 80; // Adjust this value to control the speed of viseme transitions

        visemes.forEach((viseme, index) => {
            if (viseme.indexOf('PAUSE') > -1) {
                // Handle pause 
                 // Split the viseme name and duration
                delay += parseInt(viseme.split('_')[1]);
                this.animationManager.setVisemeToNeutral(0); // Use the interval as the duration for the pause
            } else {
                setTimeout(() => {
                    this.animationManager.applyVisemeChange(viseme, 70, 0)
                }, delay);
                delay += visemeInterval; // Ensure a consistent interval between viseme changes
            }
        });

        setTimeout(() => {
            this.animationManager.setVisemeToNeutral(); // Reset viseme after speech
        }, delay); // Add a slight delay after the last viseme
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

import PhonemeExtractor from './PhonemeExtractor';
import VisemeMapper from './VisemeMapper';
import PhonemeExtractor from './PhonemeExtractor';

class VoiceManager {
    constructor(animationManager) {
        this.animationManager = animationManager;
        this.visemeMapper = new VisemeMapper();
        this.phonemeExtractor = new PhonemeExtractor();
        this.queue = [];
        this.speaking = false;
    }

    speak(text) {
        this.enqueueText(text);
        if (!this.speaking) {
            this.processQueue();
        }
    }

    enqueueText(text) {
        this.queue.push(text);
    }

    processQueue() {
        if (this.queue.length === 0) {
            this.speaking = false;
            return;
        }

        this.speaking = true;
        const text = this.queue.shift();
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.onboundary = (event) => {
            if (event.name === "word") {
                const phonemes = this.phonemeExtractor.extractPhonemes(text);
                this.applyVisemes(phonemes);
            }
        };

        utterance.onend = () => {
            this.setVisemeToNeutral();
            this.processQueue();
        };

        window.speechSynthesis.speak(utterance);
    }

    applyVisemes(phonemes) {
        const visemes = this.visemeMapper.mapPhonemesToVisemes(phonemes);
        let delay = 0;
        visemes.forEach(({ viseme, duration }) => {
            setTimeout(() => {
                this.animationManager.facsLib.setTargetViseme(viseme, 70, 0);
                this.animationManager.facsLib.updateEngine();
            }, delay);
            delay += duration; // Use the calculated duration
        });
        this.animationManager.facsLib.updateEngine();
    }

    setVisemeToNeutral() {
        this.animationManager.setVisemeToNeutral();
    }
}

export default VoiceManager;

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
                    const phonemes = this.phonemeExtractor.extractPhonemes(event.utterance.text);
                    const visemes = this.visemeMapper.mapPhonemesToVisemes(phonemes);
                    this.applyVisemes(visemes);
                }
            };

            this.synth.speak(utterThis);
        });
    }

    applyVisemes(visemes) {
        let delay = 0;
        const visemeInterval = 80; // Adjust this value to control the speed of viseme transitions

        visemes.forEach((viseme, index) => {
            if (viseme.indexOf('PAUSE') > -1) {
                // Handle pause 
                 // Split the viseme name and duration
                delay += parseInt(viseme.spit('_')[1]);
                this.animationManager.setVisemeToNeutral(0); // Use the interval as the duration for the pause
            } else {
                setTimeout(() => {
                    this.animationManager.applyVisemeChange(viseme, 70, 0)
                }, delay);
                delay += visemeInterval; // Ensure a consistent interval between viseme changes
            }
        });

        setTimeout(() => {
            this.animationManager.setVisemeToNeutral(); // Reset viseme after speech
        }, delay); // Add a slight delay after the last viseme
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

