import ReactDOMClient from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import AudioToText from './../VISOS/perception/audio/AudioToText';
import TextToListenerWithFollowUp from './../VISOS/perception/audio/TextToListenerWithFollowUp';
import TextToGptReconciler from './../VISOS/cognition/TextToGptReconciler';
import VoiceManager from './../VISOS/action/verbalizers/VoiceManager';
import TrafficLightIndicator from '../components/TrafficLightIndicator';

let audioToText;
let textToListenerWithFollowUp;
let gptReconciler;
let voiceManager;
let conversationStarted = false; // Track conversation state
let speaking = false;
let agentSpeech = ''; // Track agent's last spoken phrase
let root = null;
const listenBufferTime = 2000; // Buffer time to resume listening after speaking
const maxUtteranceLength = 120; // Max characters per utterance

// Function to set the voice to a specific voice and ensure it's available
const setVoice = (voiceName) => {
    return new Promise((resolve) => {
        console.log(`Attempting to set the voice to ${voiceName}...`);
        const checkVoices = () => {
            const selectedVoice = voiceManager.getVoices().find(voice => voice.name.includes(voiceName));
            if (selectedVoice) {
                voiceManager.setVoice(selectedVoice.name);
                console.log(`Voice set: ${selectedVoice.name}`);
                resolve();
            } else {
                console.log(`${voiceName} voice not found, retrying...`);
                setTimeout(checkVoices, 500);  // Retry until the voice is available
            }
        };
        checkVoices();
    });
};

// Initialize necessary modules
const initializeModules = (animationManager, appSettings) => {
    const triggerPhrases = appSettings.triggerPhrases || [];
    const apiKey = appSettings.apiKey;

    audioToText = new AudioToText('webspeech');
    textToListenerWithFollowUp = new TextToListenerWithFollowUp(triggerPhrases, listenBufferTime, audioToText);
    gptReconciler = new TextToGptReconciler(apiKey);
    voiceManager = VoiceManager.getInstance(animationManager);

    // Set the voice to "Samantha" (or whatever voice is preferred)
    return setVoice('Samantha');
};

// Ensure the agent does not respond to its own speech
const shouldIgnoreText = (text) => {
    return agentSpeech && text.includes(agentSpeech);
};

// Break response into smaller utterances
const breakResponseIntoChunks = (response) => {
    const chunks = [];
    let currentChunk = '';

    response.split(' ').forEach(word => {
        if (currentChunk.length + word.length + 1 > maxUtteranceLength) {
            chunks.push(currentChunk);
            currentChunk = word;
        } else {
            currentChunk += (currentChunk.length === 0 ? '' : ' ') + word;
        }
    });

    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
};

// Handle transcribed text and restart listening
const handleTranscribedText = (text, setStatus, toast) => {
    if (shouldIgnoreText(text)) {
        console.log('Ignoring agent’s own speech.');
        return;
    }

    console.log(`Transcribed text: ${text}`);
    toast({
        title: 'Transcribed text',
        description: text,
        status: 'info',
        duration: 2000,
    });

    // Handle trigger and follow-ups differently
    if (!conversationStarted) {
        handleTriggerPhrase(text, setStatus, toast);
    } else {
        handleFollowUp(text, setStatus, toast);
    }
};

// Handle the initial trigger phrase and start the conversation
const handleTriggerPhrase = (triggerPhrase, setStatus, toast) => {
    conversationStarted = true; // Mark conversation as started
    agentSpeech = "Let me check that for you...";
    speaking = true;

    textToListenerWithFollowUp.stopListening();

    // Use the currently selected voice from the VoiceManager
    voiceManager.enqueueText(agentSpeech);
    setStatus('talking');

    toast({
        title: 'Trigger Detected',
        description: `You said: \"${triggerPhrase}\". Processing...`,
        status: 'success',
        duration: 3000,
    });

    gptReconciler.processText(triggerPhrase, 'Answer seriously:')
        .then(response => {
            if (response) {
                const utterances = breakResponseIntoChunks(response);
                utterances.forEach(utterance => {
                    // Use the currently selected voice for each utterance
                    voiceManager.enqueueText(utterance);
                });
                agentSpeech = response;
            }

            setStatus('idle');
            speaking = false;

            setTimeout(() => {
                console.log("Resuming listening after trigger response...");
                textToListenerWithFollowUp.resumeListeningAfterResponse(setStatus, (text) => handleTranscribedText(text, setStatus, toast));
            }, listenBufferTime); // Adjust buffer time if necessary
        })
        .catch(error => {
            console.error("Error processing trigger phrase:", error);
            textToListenerWithFollowUp.resumeListeningAfterResponse(setStatus, (text) => handleTranscribedText(text, setStatus, toast));
        });
};

// Handle follow-up text after the conversation has started
const handleFollowUp = (followUpText, setStatus, toast) => {
    speaking = true;
    textToListenerWithFollowUp.stopListening();

    gptReconciler.processText(followUpText, 'Answer seriously:')
        .then(response => {
            if (response) {
                const utterances = breakResponseIntoChunks(response);
                utterances.forEach(utterance => {
                    // Use the currently selected voice for each utterance
                    voiceManager.enqueueText(utterance);
                });
                agentSpeech = response;
            }

            setStatus('idle');
            speaking = false;

            setTimeout(() => {
                console.log("Resuming listening after follow-up...");
                textToListenerWithFollowUp.resumeListeningAfterResponse(setStatus, (text) => handleTranscribedText(text, setStatus, toast));
            }, listenBufferTime); // Adjust buffer time if necessary
        })
        .catch(error => {
            console.error("Error processing follow-up:", error);
            textToListenerWithFollowUp.resumeListeningAfterResponse(setStatus, (text) => handleTranscribedText(text, setStatus, toast));
        });
};

// Start the chat app
export const start = (animationManager, appSettings, containerRef) => {
    if (!containerRef || !containerRef.current) {
        console.error('Invalid container reference');
        return;
    }

    initializeModules(animationManager, appSettings)
        .then(() => {
            const ChatApp = () => {
                const [status, setStatus] = useState('idle');
                const toast = useToast();

                useEffect(() => {
                    textToListenerWithFollowUp.startListening((text) => handleTranscribedText(text, setStatus, toast));

                    return () => {
                        audioToText.stopRecognition();
                    };
                }, [setStatus, toast]);

                return <TrafficLightIndicator status={status} />;
            };

            if (!root) {
                root = ReactDOMClient.createRoot(containerRef.current);
            }

            root.render(<ChatApp />);
        });
};

// Stop the chat app
export const stop = () => {
    if (audioToText) {
        audioToText.stopRecognition();
    }
    if (voiceManager) {
        voiceManager.stopSpeech();
    }
    if (root) {
        root.unmount();
        root = null;
    }
};