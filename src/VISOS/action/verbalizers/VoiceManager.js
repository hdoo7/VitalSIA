import PhonemeExtractor from './PhonemeExtractor';
import VisemeMapper from './VisemeMapper';
import PitchAnalyzer from './PitchAnalyzer';
import natural from 'natural';

export default class VoiceManager {
    static instance = null;  // Static instance for singleton

    constructor(animationManager, pitchEnhance = false) {
        this.animationManager = animationManager;
        this.queue = [];
        this.isSpeaking = false;
        this.pitchEnhance = pitchEnhance;
        this.synth = window.speechSynthesis;
        this.voice = null; // Currently selected voice
        this.phonemeExtractor = new PhonemeExtractor();
        this.visemeMapper = new VisemeMapper();
        this.pitchAnalyzer = new PitchAnalyzer();
        this.voicesLoadedPromise = this.initVoices(); // Store the voices loading promise
        this.sentenceTokenizer = new natural.SentenceTokenizer(); // Initialize sentence tokenizer
    }

    static getInstance(animationManager, pitchEnhance = false) {
        if (!VoiceManager.instance) {
            VoiceManager.instance = new VoiceManager(animationManager, pitchEnhance);
        }
        return VoiceManager.instance;
    }

    initVoices() {
        return new Promise((resolve) => {
            this.synth.onvoiceschanged = () => {
                const voices = this.getVoices();
                if (!this.voice) {
                    this.voice = voices.find(voice => voice.name === 'Google US English' || voice.name === 'en-US') || voices[0];
                }
                resolve(voices);
            };
        });
    }

    getVoices() {
        return this.synth.getVoices();
    }

    waitForVoices() {
        return new Promise((resolve) => {
            let voices = this.synth.getVoices();
            if (voices.length !== 0) {
                resolve(voices);
            } else {
                this.synth.onvoiceschanged = () => {
                    voices = this.synth.getVoices();
                    resolve(voices);
                };
            }
        });
    }

    // Updated method to find and set a voice by name, waiting for voices to load if necessary
    async findAndSetVoice(voiceName) {
        const voices = await this.waitForVoices();
        const foundVoice = voices.find(v => v.name.includes(voiceName));
        if (foundVoice) {
            this.setVoice(foundVoice.name);
            console.log(`Voice set to: ${foundVoice.name}`);
        } else {
            console.warn(`Voice "${voiceName}" not found.`);
        }
    }

    setVoice(voiceName) {
        const voice = this.synth.getVoices().find(v => v.name === voiceName);
        if (voice) {
            this.voice = voice;
        }
    }

    getSelectedVoice() {
        return this.voice;
    }

    setPitchEnhance(pitchEnhance) {
        this.pitchEnhance = pitchEnhance;
    }

    // Updated enqueueText to break text into sentences and return a promise when finished
    enqueueText(text) {
        return new Promise((resolve, reject) => {
            // Check if text is empty or undefined
            if (!text || typeof text !== 'string' || text.trim() === '') {
                console.warn("Attempted to speak empty or undefined text.");
                resolve();  // Immediately resolve the promise if text is invalid
                return;
            }

            const sentences = this.sentenceTokenizer.tokenize(text);  // Break text into sentences
            sentences.forEach((sentence) => {
                this.queue.push({ text: sentence, resolve });
            });
            if (!this.isSpeaking) {
                this.processQueue();
            }
        });
    }

    processQueue() {
        if (this.queue.length === 0) {
            this.isSpeaking = false;
            return;
        }

        this.isSpeaking = true;
        const { text, resolve } = this.queue.shift();
        this.synthesizeSpeech(text).then(() => {
            resolve();  // Resolve the promise when this text finishes
            this.processQueue();  // Process the next text in the queue
        });
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
                resolve();  // Resolve to continue processing the queue
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