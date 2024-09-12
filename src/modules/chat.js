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
const listenBufferTime = 1000;  // Buffer time to resume listening after speaking

// Initialize necessary modules
const initializeModules = (animationManager, appSettings) => {
    const triggerPhrases = appSettings.triggerPhrases;
    const apiKey = appSettings.apiKey;

    audioToText = new AudioToText('webspeech');
    textToListenerWithFollowUp = new TextToListenerWithFollowUp([triggerPhrases]);
    gptReconciler = new TextToGptReconciler(apiKey);
    voiceManager = VoiceManager.getInstance(animationManager);  // Use shared instance
};

// Ensure the agent does not respond to its own speech
const shouldIgnoreText = (text) => {
    return agentSpeech && text.includes(agentSpeech);  // Prevent response to agent's own speech
};

// Handle transcribed text
const handleTranscribedText = (text, setStatus, toast) => {
    // Ensure that only new text is processed
    const latestText = text.split(' ').slice(-10).join(' '); // Only process the last part of the transcript

    if (shouldIgnoreText(latestText)) {
        console.log('Ignoring agent’s own speech.');
        return;
    }

    console.log(`Transcribed text: ${latestText}`);
    toast({
        title: 'Transcribed text',
        description: latestText,
        status: 'info',
        duration: 2000,
    });

    // If the agent is speaking, stop speaking and process new text
    if (speaking) {
        voiceManager.stopSpeech();
        setStatus('idle');
    }

    // Process the continuous stream of transcribed text
    textToListenerWithFollowUp.listenForStream(latestText)
        .then(result => {
            if (!result) {
                handleTriggerPhraseWithoutFollowUp(setStatus, toast);
                return;
            }

            if (result.phrase && !conversationStarted) {
                handleTriggerPhrase(result.phrase, latestText, setStatus, toast);
            } else if (result.followUp && conversationStarted) {
                handleFollowUp(result.followUp, setStatus, toast);
            }
        })
        .catch(error => {
            console.error("Error processing text:", error);
        });
};

// Handle the trigger phrase without follow-up
const handleTriggerPhraseWithoutFollowUp = (setStatus, toast) => {
    agentSpeech = "Hello! I'm here to assist. You can start by saying something or asking a question.";
    speaking = true;
    voiceManager.enqueueText(agentSpeech);
    conversationStarted = true;

    toast({
        title: "Trigger phrase detected",
        description: agentSpeech,
        status: "info",
        duration: 2000,
    });

    setStatus('talking');
    setTimeout(() => {
        speaking = false;
        setStatus('listening');
        audioToText.startContinuousRecognition((text) => handleTranscribedText(text, setStatus, toast));
    }, listenBufferTime);
};

// Handle the trigger phrase with or without follow-up text
const handleTriggerPhrase = (triggerPhrase, fullText, setStatus, toast) => {
    conversationStarted = true;

    if (triggerPhrase && fullText !== triggerPhrase) {
        agentSpeech = "Let me check that for you...";
        speaking = true;
        voiceManager.enqueueText(agentSpeech);
        setStatus('talking');

        gptReconciler.processText(fullText, 'Answer seriously:')
            .then(response => {
                if (response) {
                    voiceManager.enqueueText(response);
                    agentSpeech = response;  // Store the agent's response
                }

                setStatus('idle');
                setTimeout(() => {
                    speaking = false;
                    setStatus('listening');
                    audioToText.startContinuousRecognition((text) => handleTranscribedText(text, setStatus, toast));
                }, listenBufferTime);
            });
    } else {
        handleTriggerPhraseWithoutFollowUp(setStatus, toast);
    }
};

// Handle follow-up text
const handleFollowUp = (followUpText, setStatus, toast) => {
    speaking = true;
    setStatus('talking');
    gptReconciler.processText(followUpText, 'Answer seriously:')
        .then(response => {
            if (response) {
                voiceManager.enqueueText(response);
                agentSpeech = response;  // Store the agent's response
            }

            setStatus('idle');
            setTimeout(() => {
                speaking = false;
                setStatus('listening');
                audioToText.startContinuousRecognition((text) => handleTranscribedText(text, setStatus, toast));
            }, listenBufferTime);
        });
};

// Start function to initialize and render the ChatApp using ReactDOM
export const start = (animationManager, appSettings, containerRef) => {
    if (!containerRef || !containerRef.current) {
        console.error('Invalid container reference');
        return;
    }

    // Initialize modules
    initializeModules(animationManager, appSettings);

    // React component for ChatApp
    const ChatApp = () => {
        const [status, setStatus] = useState('idle');
        const toast = useToast();

        // Render the traffic light and handle continuous recognition
        useEffect(() => {
            audioToText.startContinuousRecognition((text) => handleTranscribedText(text, setStatus, toast));

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