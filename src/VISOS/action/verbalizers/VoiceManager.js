import { SpeechConfig, SpeechSynthesizer, SpeechSynthesisOutputFormat } from 'microsoft-cognitiveservices-speech-sdk';
import PhonemeExtractor from './PhonemeExtractor';
import VisemeMapper from './VisemeMapper';
import PitchAnalyzer from './PitchAnalyzer';

export default class VoiceManager {
    static instance = null;

    constructor(animationManager, pitchEnhance = false) {
        this.animationManager = animationManager;
        this.synth = window.speechSynthesis;
        this.queue = [];
        this.isSpeaking = false;
        this.pitchEnhance = pitchEnhance;
        this.azureConfig = null;
        this.phonemeExtractor = new PhonemeExtractor();
        this.visemeMapper = new VisemeMapper();
        this.pitchAnalyzer = new PitchAnalyzer();
        this.resolveQueue = null;
    }

    setPitchEnhance(pitchEnhance) {
        this.pitchEnhance = pitchEnhance;
    }

    getVoices() {
        return this.synth.getVoices();
    }

    static getInstance(animationManager, pitchEnhance = false) {
        if (!VoiceManager.instance) {
            VoiceManager.instance = new VoiceManager(animationManager, pitchEnhance);
        }
        return VoiceManager.instance;
    }

    initAzureConfig(subscriptionKey, region) {
        this.azureConfig = SpeechConfig.fromSubscription(subscriptionKey, region);
        this.azureConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm;
    }

    findAndSetVoice(voiceName) {
        return new Promise((resolve, reject) => {
            if (!this.azureConfig) {
                console.error("Azure configuration is not initialized.");
                reject(new Error("Azure configuration missing."));
                return;
            }

            this.azureConfig.speechSynthesisVoiceName = voiceName;
            console.log(`Voice set to: ${voiceName}`);
            resolve();
        });
    }

    enqueueText(text) {
        return new Promise((resolve) => {
            if (!text || typeof text !== 'string' || text.trim() === '') {
                console.warn("Attempted to speak empty or undefined text.");
                resolve();
                return;
            }

            this.resolveQueue = resolve;
            this.queue.push(text);

            if (!this.isSpeaking) {
                this.processQueue();
            }
        });
    }

    async processQueue() {
        if (this.queue.length === 0) {
            this.isSpeaking = false;
            if (this.resolveQueue) {
                this.resolveQueue();
                this.resolveQueue = null;
            }
            return;
        }

        this.isSpeaking = true;
        const text = this.queue.shift();
        try {
            await this.synthesizeSpeech(text);
        } catch (error) {
            console.error("Error during speech synthesis:", error);
        }
        this.processQueue();
    }

    synthesizeSpeech(text) {
        return new Promise((resolve, reject) => {
            if (!this.azureConfig) {
                console.error("Azure configuration is not initialized.");
                reject(new Error("Azure configuration missing."));
                return;
            }
    
            const speechSynthesizer = new SpeechSynthesizer(this.azureConfig);
    
            speechSynthesizer.speakTextAsync(
                text,
                async (result) => {
                    const audioData = result.audioData;
                    speechSynthesizer.close();
    
                    try {
                        // Step 1: Extract phonemes from the text
                        const phonemes = this.phonemeExtractor.extractPhonemes(text);
    
                        // Step 2: Map the phonemes to visemes (mouth shapes)
                        const visemes = this.visemeMapper.mapPhonemesToVisemes(phonemes);
    
                        // Step 3: Apply the mapped visemes to the animation model (mouth movements)
                        this.applyVisemes(visemes); 
    
                        // Step 4: Play the audio corresponding to the speech
                        await this.playAudio(audioData);
    
                        // Step 5: Set the viseme to neutral after the speech ends (optional)
                        this.animationManager.setVisemeToNeutral(); 
    
                        resolve();
                    } catch (playError) {
                        console.error("Error during speech processing or animation:", playError);
                        reject(playError);
                    }
                },
                (error) => {
                    console.error("Azure TTS synthesis error:", error);
                    speechSynthesizer.close();
                    reject(error);
                }
            );
        });
    }
    

    playAudio(audioData) {
        return new Promise((resolve) => {
            const audioBlob = new Blob([audioData], { type: "audio/wav" });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);

            audio.onplay = () => {
                console.log("Audio playback started.");
            };
            audio.onended = () => {
                console.log("Audio playback ended.");
                resolve();
            };
            audio.onerror = (e) => {
                console.error("Audio playback error:", e);
                resolve();
            };

            audio.play();
        });
    }

    applyVisemes(visemes) {
        let delay = 5;
        const wordDurations = {}; 
    
        // Iterate over each viseme and track word durations
        visemes.forEach(({ viseme, duration, word }, index) => {
            if (!wordDurations[word]) {
                wordDurations[word] = 0;
            }
            wordDurations[word] += duration; 
        });
    
        // Iterate and apply visemes with better timing control
        visemes.forEach(({ viseme, duration, word }, index) => {
            const adjustedDuration = duration * 0.47;
            const adjustedDelay = delay;
    
            if (viseme === 'PAUSE' && index !== visemes.length - 1) {
                delay += adjustedDuration;
                this.animationManager.applyVisemeChange(0, 1, 0);
            } else {
                setTimeout(() => {
                    this.animationManager.applyVisemeChange(viseme, 80, 0);
                }, adjustedDelay);
                delay += adjustedDuration;
            }
    
            // End the word with neutral viseme after the last viseme in that word
            if (index === visemes.length - 1 || visemes[index + 1].word !== word) {
                setTimeout(() => {
                    this.animationManager.applyVisemeChange(viseme, 0, 0);
                }, delay);
            }
        });
    
        setTimeout(() => {
            this.animationManager.setVisemeToNeutral();
        }, delay);
    }
    
    
    stopSpeech() {
        this.queue = [];
        this.isSpeaking = false;
        this.animationManager.setVisemeToNeutral();
        console.log("Speech synthesis stopped.");
    }

    interruptSpeech(text) {
        this.stopSpeech();
        if (text) {
            this.enqueueText(text);
        }
        console.log("Speech synthesis interrupted.");
    }
}
