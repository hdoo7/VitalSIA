import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useToast, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client';
import useConvo from '../hooks/useConvo';
import useMirroring from '../hooks/useMirroring';
import AudioToText from '../VISOS/perception/audio/AudioToText';
import VoiceManager from '../VISOS/action/verbalizers/VoiceManager';
import TrafficLightIndicator from '../components/TrafficLightIndicator';
import EmotionDetection from '../components/EmotionDetection';
import { initializeChat, processTextWithGPT } from '../VISOS/cognition/TextToGptReconciler';
import { resources } from './resources';
import { start as startExpress, stop as stopExpress } from './expressions.js'; 



let root = null;

const ChatApp = ({ apiKey, animationManager }) => {
    startExpress(window.animationManager, {}); 

    const toast = useToast();
    const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);
    const [isFinishedOpen, setIsFinishedOpen] = useState(false);
    const [finalResources, setFinalResources] = useState([]);
    const [emotionState, setEmotionState] = useState(null); // Track emotion state for mirroring
    const audioToText = useRef(new AudioToText('webspeech')).current;

    const voiceManager = useRef(VoiceManager.getInstance(animationManager)).current;

    // Initialize VoiceManager with Azure configuration
    useEffect(() => {
        voiceManager.initAzureConfig('ChLHDVUzHy3c9udPJUfemo10B8i4C7Ofcp7z8m9TPX77FyxDizo8JQQJ99AKACYeBjFXJ3w3AAAYACOGg9zu', 'eastus');
    }, [voiceManager]);

    // Emotion mirroring hook
    useMirroring(animationManager, emotionState);

    // Initialize chat
    useEffect(() => {
        initializeChat(apiKey);
    }, [apiKey]);

    // Generator logic for GPT flow
    const gptFlowGenerator = useMemo(() => {
        return function* () {
            let response = "";
            const now = new Date();
            const hour = now.getHours();

            if (hour >= 5 && hour < 12) {
                response = yield "Good morning! Thank you for coming in today. How are you?";
            } else if (hour >= 12 && hour < 18) {
                response = yield "Good afternoon! How are you?";
            } else {
                response = yield "Good evening! How are you feeling?";
            }

            while (true) {
                try {
                    response = yield processTextWithGPT(apiKey, response);
                    if (response.includes("screening complete")) {
                        setIsFinishedOpen(true);
                        const resourcesList = determineResources(response);
                        setFinalResources(resourcesList);
                        return "Thank you again for coming in today...";
                    }
                } catch (error) {
                    console.error("Error in GPT flow:", error);
                    response = "I encountered an issue. Could you repeat that?";
                }
            }
        };
    }, [apiKey]);

    const determineResources = (gptResponse) => {
        if (gptResponse.includes("emotional state")) return resources.emotionalWellbeing;
        if (gptResponse.includes("daily activities")) return resources.dailyActivities;
        if (gptResponse.includes("eating habits") || gptResponse.includes("nutrition")) return resources.healthyEating;
        if (gptResponse.includes("healthy lifestyle")) return resources.healthyLifestyle;
        return [];
    };

    const gptFlowRef = useRef(gptFlowGenerator());

    // Use conversation hook
    const { conversationState, startConversation, stopConversation } = useConvo(
        audioToText,
        voiceManager,
        () => gptFlowRef.current
    );

    useEffect(() => {
        if (!gptFlowRef.current) {
            gptFlowRef.current = gptFlowGenerator();
        }

        // Find and set preferred voice (Azure TTS)
        voiceManager.findAndSetVoice('en-US-Ava:DragonHDLatestNeural').then(() => { // Adjust voice as needed
            startConversation();
        });

        return () => {
            stopConversation();
        };
    }, [startConversation, stopConversation, voiceManager, gptFlowGenerator]);

    useEffect(() => {
        if (conversationState.status === 'thinking') {
            toast({
                title: 'Processing...',
                description: 'Hold on a moment while I process that.',
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

    return (
        <>
            <TrafficLightIndicator status={conversationState.status} />

            <EmotionDetection onEmotionStateChange={setEmotionState} />

            {/* Welcome Modal */}
            <Modal isOpen={isWelcomeOpen} onClose={() => setIsWelcomeOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Welcome to VitalSIA</ModalHeader>
                    <ModalBody>
                        <p>"Empowering Health, One Step at a Time. Your Health, Our Priority."</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={() => setIsWelcomeOpen(false)}>
                            Start Session
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Finish Modal */}
            <Modal isOpen={isFinishedOpen} onClose={() => setIsFinishedOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Session Complete</ModalHeader>
                    <ModalBody>
                        <p>Thank you for sharing your thoughts. Based on your responses, here are some resources for you:</p>
                        <ul>
                            {finalResources.map((resource, index) => (
                                <li key={index}>{resource}</li>
                            ))}
                        </ul>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="green" onClick={() => setIsFinishedOpen(false)}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

// Start and Stop functions for the ChatApp
export const start = async (animationManager, appSettings, containerRef) => {
    if (!containerRef || !containerRef.current) {
        console.error('Invalid container reference');
        return;
    }

    const { apiKey, preferredVoice } = appSettings;

    if (!root) {
        root = createRoot(containerRef.current);
    }

    root.render(<ChatApp apiKey={apiKey} animationManager={animationManager} />);
};

export const stop = () => {
    if (root) {
        root.unmount();
        root = null;
    }
};
