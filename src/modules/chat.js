import ReactDOMClient from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import AudioToText from './../VISOS/perception/audio/AudioToText';
import ConversationManager from './../VISOS/cognition/ConversationManager';
import TextToGptReconciler from './../VISOS/cognition/TextToGptReconciler';
import VoiceManager from './../VISOS/action/verbalizers/VoiceManager';
import TrafficLightIndicator from '../components/TrafficLightIndicator';

let voiceManager;
let audioToText;
let conversationManager;
let gptReconciler;
let root = null;

// Function to set the voice
const setVoice = async (voiceName) => {
    try {
        await voiceManager.findAndSetVoice(voiceName);
        console.log(`Voice set: ${voiceName}`);
    } catch {
        console.log(`Voice not found: ${voiceName}`);
    }
};

// Initialize core modules
const initializeModules = async (animationManager, appSettings) => {
    const { apiKey, preferredVoice } = appSettings;

    audioToText = new AudioToText('webspeech');
    voiceManager = VoiceManager.getInstance(animationManager);
    conversationManager = new ConversationManager(1000, audioToText, voiceManager);
    gptReconciler = new TextToGptReconciler(apiKey);
    await setVoice(preferredVoice || 'Google UK English');
};

// Function to handle conversation responses
const handleResponse = async (text, setStatus, toast) => {
    toast({
        title: 'Transcribed Text',
        description: text,
        status: 'info',
        duration: 2000,
    });

    setStatus('thinking');  // Set to thinking while GPT processes the response

    const response = await gptReconciler.processText(text, 'Answer as a very bubbly person would:');
    
    setStatus('talking');  // Set to talking while agent speaks
    await voiceManager.enqueueText(response);

    setStatus('listening');  // Return to listening after response
    conversationManager.resumeListeningAfterResponse(setStatus).then((newText) => {
        handleResponse(newText, setStatus, toast);
    });
};

// Agent introduction
const introduceAgent = async (setStatus, toast) => {
    const intro = "Hello! I'm your virtual assistant. How can I help you today?";
    
    setStatus('talking');  // Set status to talking during introduction
    await voiceManager.enqueueText(intro);
    
    setStatus('listening');  // Set status to listening after introduction
    conversationManager.startListening().then((text) => {
        handleResponse(text, setStatus, toast);
    });
};

// Start the chat app
export const start = async (animationManager, appSettings, containerRef) => {
    if (!containerRef || !containerRef.current) {
        console.error('Invalid container reference');
        return;
    }

    await initializeModules(animationManager, appSettings);

    const ChatApp = () => {
        const [status, setStatus] = useState('listening'); // Initialize with listening state
        const toast = useToast();

        useEffect(() => {
            introduceAgent(setStatus, toast);
            return () => {
                audioToText.stopRecognition();
            };
        }, [setStatus, toast]);

        return <TrafficLightIndicator status={status} />;  // Pass status to the TrafficLightIndicator
    };

    if (!root) {
        root = ReactDOMClient.createRoot(containerRef.current);
    }

    root.render(<ChatApp />);
};

// Stop the chat app
export const stop = () => {
    console.log("Stopping chat app...");
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