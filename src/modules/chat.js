import ReactDOMClient from 'react-dom/client';
import React, { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import AudioToText from './../VISOS/perception/audio/AudioToText';
import VoiceManager from './../VISOS/action/verbalizers/VoiceManager';
import TrafficLightIndicator from '../components/TrafficLightIndicator';
import useConvo from './../hooks/useConvo';
import TextToGptReconciler from './../VISOS/cognition/TextToGptReconciler';

let voiceManager;
let audioToText;
let gptReconciler;
let root = null;

const initializeModules = async (animationManager, appSettings) => {
    const { apiKey, preferredVoice } = appSettings;

    audioToText = new AudioToText('webspeech');
    voiceManager = VoiceManager.getInstance(animationManager);
    gptReconciler = new TextToGptReconciler(apiKey);

    await voiceManager.findAndSetVoice(preferredVoice || 'Bubbles');
};

export const start = async (animationManager, appSettings, containerRef) => {
    if (!containerRef || !containerRef.current) {
        console.error('Invalid container reference');
        return;
    }

    await initializeModules(animationManager, appSettings);

    const ChatApp = () => {
        const { conversationState, startConversation, stopConversation } = useConvo(audioToText, voiceManager, gptReconciler);
        const toast = useToast();

        useEffect(() => {
            startConversation();
            return () => stopConversation();
        }, [startConversation, stopConversation]);

        useEffect(() => {
            if (conversationState.status === 'thinking') {
                toast({
                    title: 'Processing...',
                    description: 'Processing your response...',
                    status: 'info',
                    duration: 2000,
                });
            } else if (conversationState.status === 'talking') {
                toast({
                    title: 'Response',
                    description: conversationState.gptResponse,
                    status: 'success',
                    duration: 4000,
                });
            }
        }, [conversationState.status, conversationState.gptResponse, toast]);

        return <TrafficLightIndicator status={conversationState.status} />;
    };

    if (!root) {
        root = ReactDOMClient.createRoot(containerRef.current);
    }

    root.render(<ChatApp />);
};

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