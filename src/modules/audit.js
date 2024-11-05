import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useToast, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client';
import useConvo from './../hooks/useConvo';
import useMirroring from './../hooks/useMirroring';
import AudioToText from './../VISOS/perception/audio/AudioToText';
import VoiceManager from './../VISOS/action/verbalizers/VoiceManager';
import TrafficLightIndicator from '../components/TrafficLightIndicator';
import EmotionDetection from '../components/EmotionDetection';
import { initializeChat, processTextWithGPT } from './../VISOS/cognition/TextToGptReconciler';
import { resources } from './resources';

let root = null;

const ChatApp = ({ apiKey, animationManager }) => {
    const toast = useToast();
    const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);
    const [isFinishedOpen, setIsFinishedOpen] = useState(false);
    const [finalResources, setFinalResources] = useState([]);
    const [emotionState, setEmotionState] = useState(null);  // Track emotion state for mirroring
    const audioToText = useRef(new AudioToText('webspeech')).current;
    const voiceManager = useRef(VoiceManager.getInstance(animationManager)).current;

    // Emotion mirroring hook
    useMirroring(animationManager, emotionState);

    // Initialize chat
    useEffect(() => {
        initializeChat(apiKey);
    }, [apiKey]);

    // Generator logic for GPT flow
    const gptFlowGenerator = useMemo(() => {
        return function* () {
            let response = yield "Hello! Let's begin the AUDIT screening. Are you ready to get started?";
            while (true) {
                response = yield processTextWithGPT(apiKey, response);
                if (response.includes("screening complete")) {
                    setIsFinishedOpen(true);
                    const resourcesList = determineResources(response);
                    setFinalResources(resourcesList);
                    return "Thank you for completing the screening. Here are some resources based on your responses.";
                }
            }
        };
    }, [apiKey]);

    // Determines resources based on GPT response
    const determineResources = (gptResponse) => {
        if (gptResponse.includes("no drinking")) return resources.noDrinking;
        if (gptResponse.includes("low risk")) return resources.lowRisk;
        if (gptResponse.includes("moderate risk")) return resources.moderateRisk;
        if (gptResponse.includes("high risk")) return resources.highRisk;
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

        voiceManager.findAndSetVoice('Google UK English Female').then(() => {
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
                    <ModalHeader>Welcome to the AUDIT Screening</ModalHeader>
                    <ModalBody>
                        <p>This screening will help assess your alcohol use habits. Please answer each question as honestly as possible.</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={() => setIsWelcomeOpen(false)}>
                            Start Screening
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Finish Modal */}
            <Modal isOpen={isFinishedOpen} onClose={() => setIsFinishedOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Screening Complete</ModalHeader>
                    <ModalBody>
                        <p>Thank you for completing the AUDIT screening. Based on your responses, here are some resources for you:</p>
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