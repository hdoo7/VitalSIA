import PhonemeExtractor from './PhonemeExtractor';
import VisemeMapper from './VisemeMapper';
import PitchAnalyzer from './PitchAnalyzer';
import natural from 'natural';
import { toWords } from 'number-to-words';  // Import the number-to-words package

export default class VoiceManager {
    static instance = null;

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
        this.voicesLoadedPromise = this.initVoices();
        this.sentenceTokenizer = new natural.SentenceTokenizer();
        this.resolveQueue = null;
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

    // Utility function to convert numbers to words, ignoring commas
    convertNumbersToWords(text) {
        return text.replace(/\b\d{1,3}(,\d{3})*\b/g, (match) => {
            const number = parseInt(match.replace(/,/g, ''), 10); // Remove commas and parse the number
            return toWords(number);
        });
    }

    // Updated enqueueText to convert numbers to words, break text into sentences, and return a single promise
    enqueueText(text) {
        return new Promise((resolve) => {
            if (!text || typeof text !== 'string' || text.trim() === '') {
                console.warn("Attempted to speak empty or undefined text.");
                resolve();  // Immediately resolve if text is invalid
                return;
            }

            // Convert numbers to words before tokenizing
            const processedText = this.convertNumbersToWords(text);
            const sentences = this.sentenceTokenizer.tokenize(processedText);

            this.resolveQueue = resolve;  // Set the resolve function to be called after all sentences

            sentences.forEach((sentence) => {
                this.queue.push({ text: sentence });
            });

            if (!this.isSpeaking) {
                this.processQueue();
            }
        });
    }

    // Process the queue with handling for completing all chunks
    processQueue() {
        if (this.queue.length === 0) {
            this.isSpeaking = false;
            if (this.resolveQueue) {
                this.resolveQueue();  // Resolve the main promise once the entire queue finishes
                this.resolveQueue = null;
            }
            return;
        }

        this.isSpeaking = true;
        const { text } = this.queue.shift();
        this.synthesizeSpeech(text).then(() => {
            this.processQueue();  // Process the next chunk in the queue
        });
    }

    synthesizeSpeech(text) {
        return new Promise((resolve) => {
            const utterThis = new SpeechSynthesisUtterance(text);
            utterThis.voice = this.voice;

            utterThis.onend = () => {
                console.log("Speech synthesis completed for chunk.");
                this.animationManager.setVisemeToNeutral();
                resolve();
            };

            utterThis.onerror = (e) => {
                console.error("Error during speech synthesis:", e);
                this.animationManager.setVisemeToNeutral();
                resolve();
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

            delay += word.length * 66; // Adjust timing based on word length
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
        this.stopSpeech();  // Stop current speech
        if (text) {
            this.enqueueText(text);
        }
        console.log("Speech synthesis interrupted.");
    }
}