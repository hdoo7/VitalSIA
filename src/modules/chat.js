    import ReactDOMClient from 'react-dom/client';
    import React, { useEffect } from 'react';
    import { useToast } from '@chakra-ui/react';
    import AudioToText from './../VISOS/perception/audio/AudioToText';
    import VoiceManager from './../VISOS/action/verbalizers/VoiceManager';
    import useConvo from './../hooks/useConvo';
    import TrafficLightIndicator from '../components/TrafficLightIndicator';
    import { processTextWithGPT } from './../VISOS/cognition/TextToGptReconciler';  // Import GPT function

    let voiceManager;
    let audioToText;
    let root = null; // Ensure this is initialized correctly

    // Generator for GPT Flow
    const gptFlowGenerator = (apiKey) => {
        return function* () {
            const response = yield `Hello!`;
            if (response.toLowerCase("contains") == `hello`){
                let userMessage = yield "How can I assist you today?";

                while (true) { 
                    
                     // Wait for user's response and use it
                    // Yield a promise that resolves after `processTextWithGPT` completes
                    userMessage = yield processTextWithGPT(apiKey, userMessage);
                }
            } else {
                yield `Sorry I don' think I can help with that.`
            }

        };
    };

    export const start = async (animationManager, appSettings, containerRef) => {
        if (!containerRef || !containerRef.current) {
            console.error('Invalid container reference');
            return;
        }

        const { apiKey, preferredVoice } = appSettings;


        // Initialize the modules
        audioToText = new AudioToText('webspeech');
        voiceManager = VoiceManager.getInstance(animationManager);
        await voiceManager.findAndSetVoice(preferredVoice || 'Google UK English Female');

        // Create GPT flow generator, passing the `apiKey`
        const gptFlow = gptFlowGenerator(apiKey);

        const ChatApp = () => {
            const toast = useToast();

            const { conversationState, startConversation, stopConversation } = useConvo(
                audioToText, 
                voiceManager, 
                gptFlow  // Pass the generator
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

        // Create the root only once, using React 18 API
        if (!root) {
            root = ReactDOMClient.createRoot(containerRef.current);
        }

        // Use the root's render method to render the component
        root.render(<ChatApp />);
    };

    // Stop the app and clean up when needed
    export const stop = () => {
        if (audioToText) {
            audioToText.stopRecognition();
        }
        if (voiceManager) {
            voiceManager.stopSpeech();
        }
        if (root) {
            root.unmount();  // Correct way to unmount in React 18
            root = null;  // Reset root
        }
    };