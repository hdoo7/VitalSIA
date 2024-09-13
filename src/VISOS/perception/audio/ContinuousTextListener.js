import ReactDOMClient from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import AudioToText from './../VISOS/perception/audio/AudioToText';
import ContinuousTextListener from './../VISOS/perception/audio/ContinuousTextListener';
import TextToGptReconciler from './../VISOS/cognition/TextToGptReconciler';
import VoiceManager from './../VISOS/action/verbalizers/VoiceManager';
import TrafficLightIndicator from '../components/TrafficLightIndicator';

let audioToText;
let continuousTextListener;
let gptReconciler;
let voiceManager;
let conversationStarted = false;
let speaking = false;
let agentSpeech = '';  // Track agent's last spoken phrase
let root = null;
const listenBufferTime = 1000;  // Buffer time to resume listening after speaking

// Initialize necessary modules
const initializeModules = (animationManager, appSettings) => {
    const triggerPhrases = appSettings.triggerPhrases;
    const apiKey = appSettings.apiKey;

    audioToText = new AudioToText('webspeech');
    continuousTextListener = new ContinuousTextListener([triggerPhrases], listenBufferTime, true);
    gptReconciler = new TextToGptReconciler(apiKey);
    voiceManager = VoiceManager.getInstance(animationManager);  // Use shared instance
};

// Ensure the agent does not respond to its own speech
const shouldIgnoreText = (text) => {
    return agentSpeech && text.includes(agentSpeech);  // Prevent response to agent's own speech
};

// Start continuous listening using ContinuousTextListener
const startContinuousListening = (setStatus, toast) => {
    const textStream = async function* () {
        while (true) {
            yield await new Promise(resolve => {
                audioToText.startContinuousRecognition(resolve);
            });
        }
    };

    continuousTextListener.startContinuousListening(textStream()).then(() => {
        setStatus('listening');
        console.log('Listening for continuous text...');
    });
};

// Handle the trigger phrase
const handleTriggerPhrase = (text, setStatus, toast) => {
    if (shouldIgnoreText(text)) {
        console.log('Ignoring agent’s own speech.');
        return;
    }

    console.log(`Trigger phrase detected: ${text}`);
    agentSpeech = "Let me check that for you...";
    speaking = true;
    voiceManager.enqueueText(agentSpeech);
    setStatus('talking');

    gptReconciler.processText(text, 'Answer seriously:')
        .then(response => {
            if (response) {
                voiceManager.enqueueText(response);
                agentSpeech = response;
            }

            setStatus('idle');
            setTimeout(() => {
                speaking = false;
                setStatus('listening');
                startContinuousListening(setStatus, toast);
            }, listenBufferTime);
        });
};

// React component for ChatApp
export const start = (animationManager, appSettings, containerRef) => {
    if (!containerRef || !containerRef.current) {
        console.error('Invalid container reference');
        return;
    }

    // Initialize modules
    initializeModules(animationManager, appSettings);

    const ChatApp = () => {
        const [status, setStatus] = useState('idle');
        const toast = useToast();

        useEffect(() => {
            startContinuousListening(setStatus, toast);

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