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
let agentSpeech = '';
let root = null;
const listenBufferTime = 2000;
const maxUtteranceLength = 120;

// Initialize necessary modules
const initializeModules = (animationManager, appSettings) => {
    const triggerPhrases = appSettings.triggerPhrases || [];
    const apiKey = appSettings.apiKey;

    audioToText = new AudioToText('webspeech');
    textToListenerWithFollowUp = new TextToListenerWithFollowUp(triggerPhrases, listenBufferTime, audioToText);
    gptReconciler = new TextToGptReconciler(apiKey);
    voiceManager = VoiceManager.getInstance(animationManager);

    voiceManager.findAndSetVoice('Samantha');
};

// Ensure the agent does not respond to its own speech
const shouldIgnoreText = (text) => {
    return agentSpeech && text.includes(agentSpeech);
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

    if (!conversationStarted) {
        handleTriggerPhrase(text, setStatus, toast);
    } else {
        handleFollowUp(text, setStatus, toast);
    }
};

// Handle the initial trigger phrase and start the conversation
const handleTriggerPhrase = (triggerPhrase, setStatus, toast) => {
    conversationStarted = true;

    // Check if there is any follow-up text after the trigger phrase
    if (triggerPhrase.trim().length > 0) {
        agentSpeech = "Let me check that for you...";
    } else {
        agentSpeech = "Hi, I’m here to help!";  // Generic greeting if there's no follow-up text
    }
    
    speaking = true;

    textToListenerWithFollowUp.stopListening();
    voiceManager.enqueueText(agentSpeech);
    setStatus('talking');

    toast({
        title: 'Trigger Detected',
        description: `You said: \"${triggerPhrase}\". Processing...`,
        status: 'success',
        duration: 3000,
    });

    // If there is text following the trigger phrase, process it
    if (triggerPhrase.trim().length > 0) {
        gptReconciler.processText(triggerPhrase, 'Answer seriously:')
            .then(response => {
                if (response) {
                    voiceManager.enqueueText(response);
                    agentSpeech = response;
                }

                setStatus('idle');
                speaking = false;

                setTimeout(() => {
                    console.log("Resuming listening after trigger response...");
                    textToListenerWithFollowUp.resumeListeningAfterResponse((text) => handleTranscribedText(text, setStatus, toast));
                }, listenBufferTime);
            })
            .catch(error => {
                console.error("Error processing trigger phrase:", error);
                textToListenerWithFollowUp.resumeListeningAfterResponse((text) => handleTranscribedText(text, setStatus, toast));
            });
    } else {
        // No follow-up text detected, resume listening immediately
        setStatus('idle');
        speaking = false;

        setTimeout(() => {
            console.log("Resuming listening after greeting...");
            textToListenerWithFollowUp.resumeListeningAfterResponse((text) => handleTranscribedText(text, setStatus, toast));
        }, listenBufferTime);
    }
};

// Handle follow-up text after the conversation has started
const handleFollowUp = (followUpText, setStatus, toast) => {
    speaking = true;
    textToListenerWithFollowUp.stopListening();

    gptReconciler.processText(followUpText, 'Answer seriously:')
        .then(response => {
            if (response) {
                voiceManager.enqueueText(response);
                agentSpeech = response;
            }

            setStatus('idle');
            speaking = false;

            setTimeout(() => {
                console.log("Resuming listening after follow-up...");
                textToListenerWithFollowUp.resumeListeningAfterResponse((text) => handleTranscribedText(text, setStatus, toast));
            }, listenBufferTime);
        })
        .catch(error => {
            console.error("Error processing follow-up:", error);
            textToListenerWithFollowUp.resumeListeningAfterResponse((text) => handleTranscribedText(text, setStatus, toast));
        });
};

// Start the chat app
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