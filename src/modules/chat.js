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
let conversationStarted = false;
let speaking = false;
let agentSpeech = '';  // Track agent's last spoken phrase
let root = null;
const listenBufferTime = 2000;  // Buffer time to resume listening after speaking
const maxUtteranceLength = 120;  // Max characters per utterance

// Initialize necessary modules
const initializeModules = (animationManager, appSettings) => {
    const triggerPhrases = appSettings.triggerPhrases || [];
    const apiKey = appSettings.apiKey;

    audioToText = new AudioToText('webspeech');
    textToListenerWithFollowUp = new TextToListenerWithFollowUp(triggerPhrases, listenBufferTime, audioToText);
    gptReconciler = new TextToGptReconciler(apiKey);
    voiceManager = VoiceManager.getInstance(animationManager);
};

// Ensure the agent does not respond to its own speech
const shouldIgnoreText = (text) => {
    return agentSpeech && text.includes(agentSpeech);  // Prevent response to agent's own speech
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

// Handle transcribed text and start/stop listening
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

    if (speaking) {
        voiceManager.stopSpeech();
        setStatus('idle');
    }

    textToListenerWithFollowUp.listenForStream(text)
        .then(result => {
            if (result.phrase && !conversationStarted) {
                handleTriggerPhrase(result.phrase, setStatus, toast);
            } else if (result.followUp && conversationStarted) {
                handleFollowUp(result.followUp, setStatus, toast);
            }
        })
        .catch(error => {
            console.error("Error processing text:", error);
        });
};

// Handle the trigger phrase
const handleTriggerPhrase = (triggerPhrase, setStatus, toast) => {
    conversationStarted = true;
    agentSpeech = "Let me check that for you...";
    speaking = true;

    // Stop listening to avoid transcribing agent's speech
    textToListenerWithFollowUp.stopListening();


    voiceManager.enqueueText(agentSpeech);
    setStatus('talking');

    toast({
        title: 'Trigger Detected',
        description: `You said: "${triggerPhrase}". Processing...`,
        status: 'success',
        duration: 3000,
    });

    gptReconciler.processText(triggerPhrase, 'Answer seriously:')
        .then(response => {
            if (response) {
                // voiceManager.setVoice(currentVoice.name);  // Ensure correct voice
                const utterances = breakResponseIntoChunks(response);
                utterances.forEach(utterance => {
                    voiceManager.enqueueText(utterance);  // Speak each chunk
                });
                agentSpeech = response;
            }

            setStatus('idle');
            speaking = false;
            textToListenerWithFollowUp.resumeListeningAfterResponse(setStatus, (text) => handleTranscribedText(text, setStatus, toast));
        });
};

// Handle follow-up text
const handleFollowUp = (followUpText, setStatus, toast) => {
    speaking = true;
    textToListenerWithFollowUp.stopListening();

    setStatus('talking');

    gptReconciler.processText(followUpText, 'Answer seriously:')
        .then(response => {
            if (response) {
                // const currentVoice = voiceManager.voice;
                // voiceManager.setVoice(currentVoice.name);
                const utterances = breakResponseIntoChunks(response);
                utterances.forEach(utterance => {
                    voiceManager.enqueueText(utterance);
                });
                agentSpeech = response;
            }

            setStatus('idle');
            speaking = false;
            textToListenerWithFollowUp.resumeListeningAfterResponse(setStatus, (text) => handleTranscribedText(text, setStatus, toast));
        });
};

// Start function to initialize and render the ChatApp using ReactDOM
export const start = (animationManager, appSettings, containerRef) => {
    if (!containerRef || !containerRef.current) {
        console.error('Invalid container reference');
        return;
    }

    initializeModules(animationManager, appSettings);

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
};

// Stop function to unmount ChatApp and stop processes
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