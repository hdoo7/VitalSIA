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
        this.sentenceTokenizer = new natural.SentenceTokenizer(); // Initialize sentence tokenizer
        this.initVoices();
    }

    static getInstance(animationManager, pitchEnhance = false) {
        if (!VoiceManager.instance) {
            VoiceManager.instance = new VoiceManager(animationManager, pitchEnhance);
        }
        return VoiceManager.instance;
    }

    initVoices() {
        this.synth.onvoiceschanged = () => {
            const voices = this.getVoices();
            if (!this.voice) {
                this.voice = voices.find(voice => voice.name === 'Google US English' || voice.name === 'en-US') || voices[0];
            }
            if (typeof this.onVoicesChanged === 'function') {
                this.onVoicesChanged(voices);
            }
        };
    }

    getVoices() {
        return this.synth.getVoices();
    }

    // New method to get the currently selected voice
    getSelectedVoice() {
        return this.voice;
    }

    // New method to find and set a voice by name, with a promise for async handling
    findAndSetVoice(voiceName) {
        return new Promise((resolve) => {
            const checkVoices = () => {
                const foundVoice = this.getVoices().find(voice => voice.name.includes(voiceName));
                if (foundVoice) {
                    this.setVoice(foundVoice.name);
                    console.log(`Voice set to: ${foundVoice.name}`);
                    resolve(foundVoice);  // Resolve when voice is successfully set
                } else {
                    console.log(`Voice "${voiceName}" not found, retrying...`);
                    setTimeout(checkVoices, 500);  // Retry after a short delay
                }
            };
            checkVoices();
        });
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

    // Chunk text into sentences using natural's SentenceTokenizer
    chunkifyText(text) {
        return this.sentenceTokenizer.tokenize(text);  // Split into sentences
    }

    enqueueText(text) {
        const sentences = this.chunkifyText(text);  // Chunkify the text into sentences
        this.queue.push(...sentences);  // Push sentences into the queue
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
        const sentence = this.queue.shift();  // Take one sentence at a time
        this.synthesizeSpeech(sentence).then(() => this.processQueue());
    }

    synthesizeSpeech(text) {
        return new Promise((resolve) => {
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