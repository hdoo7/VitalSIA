import PhonemeExtractor from './PhonemeExtractor';
import VisemeMapper from './VisemeMapper';
import PitchAnalyzer from './PitchAnalyzer';
import natural from 'natural';

export default class VoiceManager {
    constructor(animationManager, pitchEnhance = false) {
        this.animationManager = animationManager;
        this.queue = [];
        this.isSpeaking = false;
        this.pitchEnhance = pitchEnhance;
        this.synth = window.speechSynthesis;
        this.voice = null;
        this.phonemeExtractor = new PhonemeExtractor();
        this.visemeMapper = new VisemeMapper();
        this.pitchAnalyzer = new PitchAnalyzer();
        this.initVoices();
    }

    initVoices() {
        this.synth.onvoiceschanged = () => {
            const voices = this.getVoices();
            if (!this.voice) {
                this.voice = voices.find(voice => voice.name === 'Google US English' || voice.name === 'en-US') || voices[0];
            }
            this.onVoicesChanged(voices);
        };
    }

    getVoices() {
        return this.synth.getVoices();
    }

    setVoice(voiceName) {
        const voice = this.getVoices().find(v => v.name === voiceName);
        if (voice) {
            this.voice = voice;
        }
    }

    setPitchEnhance(pitchEnhance) {
        this.pitchEnhance = pitchEnhance;
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
                this.animationManager.setVisemeToNeutral();
                resolve();
            };

            utterThis.onerror = (e) => {
                console.error("Error during speech synthesis:", e);
                this.animationManager.setVisemeToNeutral();
                resolve(); // Resolve to continue processing the queue
            };

            if (this.voice && this.voice.name.includes('Google')) {
                this.handleGoogleVoiceWorkaround(text, utterThis);
            } else {
                utterThis.onboundary = (event) => {
                    if (event.name === 'word') {
                        const word = text.substring(event.charIndex, event.charIndex + event.charLength);
                        const phonemes = this.phonemeExtractor.extractPhonemes(word);
                        const visemes = this.visemeMapper.mapPhonemesToVisemes(phonemes);
                        this.applyVisemes(visemes);
                    }
                };
            }

            this.synth.speak(utterThis);
        });
    }

    handleGoogleVoiceWorkaround(text) {
        const words = text.split(' ');
        let delay = 20;

        words.forEach((word, index) => {
            setTimeout(() => {
                const phonemes = this.phonemeExtractor.extractPhonemes(word);
                const visemes = this.visemeMapper.mapPhonemesToVisemes(phonemes);
                this.applyVisemes(visemes);
            }, delay);

            delay += word.length * 66; // Adjust this timing based on the length of the word
        });

        setTimeout(() => {
            this.animationManager.setVisemeToNeutral();
        }, delay);
    }

    applyVisemes(visemes) {
        let delay = 0;

        visemes.forEach(({ viseme, duration }, i) => {
            if (viseme === 'PAUSE' && i !== visemes.length - 1) {
                delay += duration;
                this.animationManager.applyVisemeChange(0, 1, 0);
            } else {
                setTimeout(() => {
                    this.animationManager.applyVisemeChange(viseme, 80, 0);
                }, delay);
                delay += duration;
            }
            if (i === visemes.length - 1) {
                setTimeout(() => {
                    this.animationManager.applyVisemeChange(viseme, 0, 0);
                }, delay);
            }
        });

        setTimeout(() => {
            this.animationManager.setVisemeToNeutral();
        }, delay - 300);
    }

    stopSpeech() {
        this.queue = [];
        this.isSpeaking = false;
        this.synth.cancel();
        this.animationManager.setVisemeToNeutral();
        console.log("Speech synthesis stopped.");
    }

    interruptSpeech(text) {
        this.queue = [];
        this.isSpeaking = false;
        this.synth.cancel();
        this.animationManager.setVisemeToNeutral();

        if (text) {
            this.enqueueText(text);
        }

        console.log("Speech synthesis interrupted.");
    }
}