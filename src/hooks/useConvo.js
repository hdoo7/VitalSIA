import { useState, useCallback, useRef } from 'react';

const useConvo = (audioToText, voiceManager, gptFlowGenerator) => {
    const [conversationState, setConversationState] = useState({
        status: 'idle', // Possible statuses: 'idle', 'listening', 'thinking', 'talking', 'error'
        transcribedText: null, // Last transcribed text from the user
        speakingText: null, // Last text the system is speaking
    });

    const generatorRef = useRef(null); // Store the generator reference
    const isListeningRef = useRef(false); // Track if the system should listen
    const lastSpokenTextRef = useRef(null); // Track the last spoken text to avoid self-transcription

    const stopListening = useCallback(() => {
        console.log("Stopping listening...");
        audioToText.stopRecognition();
        isListeningRef.current = false; // Ensures that transcribed text will be ignored
    }, [audioToText]);

    const resumeListening = useCallback(() => {
        console.log("Preparing to resume listening...");
        setTimeout(() => {
            if (!isListeningRef.current) {
                isListeningRef.current = true; // Enable listening again
                audioToText.startContinuousRecognition(processTranscribedText);
                console.log("Listening resumed.");
            }
        }, 1000); // Buffer to avoid self-transcription
    }, [audioToText]);

    const processTranscribedText = useCallback(async (transcribedText) => {
        if (!isListeningRef.current) {
            console.log("Ignoring transcription while talking.");
            return;
        }

        if (transcribedText && lastSpokenTextRef.current && transcribedText.trim() === lastSpokenTextRef.current.trim()) {
            console.log("Ignoring self-transcription of agent's spoken text.");
            return;
        }

        stopListening();
        setConversationState((prevState) => ({
            ...prevState,
            status: 'thinking',
            transcribedText,
        }));

        try {
            const { value: responsePromise } = generatorRef.current.next(transcribedText);

            if (responsePromise instanceof Promise) {
                const response = await responsePromise;
                if (!response) return;

                setConversationState({
                    status: 'talking',
                    transcribedText,
                    speakingText: response,
                });

                lastSpokenTextRef.current = response; // Update last spoken text

                await voiceManager.enqueueText(response);

                setConversationState((prevState) => ({
                    ...prevState,
                    status: 'listening',
                    speakingText: null,
                }));

                resumeListening();
            } else if (typeof responsePromise === 'string') {
                setConversationState({
                    status: 'talking',
                    transcribedText,
                    speakingText: responsePromise,
                });

                lastSpokenTextRef.current = responsePromise; // Update last spoken text

                await voiceManager.enqueueText(responsePromise);

                setConversationState((prevState) => ({
                    ...prevState,
                    status: 'listening',
                    speakingText: null,
                }));

                resumeListening();
            } else {
                console.error("Unexpected type from generator:", responsePromise);
            }
        } catch (error) {
            console.error("Error during conversation processing:", error);
            setConversationState({
                status: 'error',
                transcribedText,
                speakingText: "There was an issue processing your request.",
            });
        }
    }, [stopListening, resumeListening, voiceManager]);

    const startConversation = useCallback(() => {
        stopListening();

        setConversationState({ status: 'listening' });

        if (!generatorRef.current) {
            generatorRef.current = gptFlowGenerator();
        }

        const { value: initialMessage } = generatorRef.current.next();

        if (typeof initialMessage === 'string') {
            setConversationState((prevState) => ({
                ...prevState,
                status: 'talking',
                speakingText: initialMessage,
            }));

            lastSpokenTextRef.current = initialMessage; // Track initial message to avoid self-transcription

            voiceManager.enqueueText(initialMessage).then(() => {
                setConversationState((prevState) => ({
                    ...prevState,
                    status: 'listening',
                    speakingText: null,
                }));
                resumeListening();
            });
        } else {
            console.error("Expected a string for initial message but got:", initialMessage);
        }
    }, [voiceManager, resumeListening, stopListening]);

    const stopConversation = useCallback(() => {
        stopListening();
        voiceManager.stopSpeech();
        setConversationState({
            status: 'idle',
            transcribedText: null,
            speakingText: null,
        });
        lastSpokenTextRef.current = null; // Clear last spoken text
    }, [stopListening, voiceManager]);

    return { conversationState, startConversation, stopConversation };
};

export default useConvo;
