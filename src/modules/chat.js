import ReactDOMClient from 'react-dom/client';
import React, { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import AudioToText from './../VISOS/perception/audio/AudioToText';
import VoiceManager from './../VISOS/action/verbalizers/VoiceManager';
import useConvo from './../hooks/useConvo';
import TrafficLightIndicator from '../components/TrafficLightIndicator';
import { processTextWithGPT } from './../VISOS/cognition/TextToGptReconciler';

let voiceManager;
let audioToText;
let root = null;

const gptFlowGenerator = (apiKey) => {
    return function* () {
        const response = yield `Hello!`;
        if (response.toLowerCase().includes("hello")) {
            let userMessage = yield "How can I assist you today?";
            while (true) {
                userMessage = yield processTextWithGPT(apiKey, userMessage);
            }
        } else {
            yield `Sorry, I don't think I can help with that.`;
        }
    };
};

export const start = async (animationManager, appSettings, containerRef) => {
    if (!containerRef || !containerRef.current) {
        console.error('Invalid container reference');
        return;
    }

    const { apiKey, preferredVoice } = appSettings;

    audioToText = new AudioToText('webspeech');
    voiceManager = VoiceManager.getInstance(animationManager);

    await voiceManager.voicesLoadedPromise;
    await voiceManager.findAndSetVoice(preferredVoice || 'Google UK English Female');

    const gptFlow = gptFlowGenerator(apiKey);

    const ChatApp = () => {
        const toast = useToast();
        const { conversationState, startConversation, stopConversation } = useConvo(
            audioToText,
            voiceManager,
            gptFlow
        );

        useEffect(() => {
            startConversation();
            return () => stopConversation();
        }, [startConversation, stopConversation]);

        useEffect(() => {
            if (conversationState.status === 'thinking') {
                toast({
                    title: 'Processing...',
                    description: 'Let me check on that for you...',
                    status: 'info',
                    duration: 2000,
                });
            } else if (conversationState.status === 'talking') {
                toast({
                    title: 'Response',
                    description: conversationState.speakingText,
                    status: 'success',
                    duration: 4000,
                });
            }
        }, [conversationState.status, conversationState.speakingText, toast]);

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