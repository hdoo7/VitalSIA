import { useState, useCallback, useRef } from 'react';

const useConvo = (audioToText, voiceManager, gptFlowGenerator) => {
    const [conversationState, setConversationState] = useState({
        status: 'idle', // Possible statuses: 'idle', 'listening', 'thinking', 'talking'
        transcribedText: null, // The last transcribed text from the user
        speakingText: null, // The last text the system is speaking
    });

    const generatorRef = useRef(null); // Store the generator reference
    const isListeningRef = useRef(false); // Ref to track whether the system is currently in the listening state

    // Function to stop listening and avoid transcribing during the system's speech
    const stopListening = useCallback(() => {
        audioToText.stopRecognition();
        isListeningRef.current = false;
    }, [audioToText]);

    // Function to resume listening after speaking
    const resumeListening = useCallback(() => {
        setTimeout(() => {
            isListeningRef.current = true;  // Enable listening again
            audioToText.startContinuousRecognition(processTranscribedText); // Resume listening
        }, 500); // Add a slight delay (e.g., 500ms) to avoid picking up the system's own voice
    }, [audioToText]);

    // Function to handle user-transcribed text
    const processTranscribedText = useCallback(async (transcribedText) => {
        if (!isListeningRef.current) {
            console.log("System is talking, ignoring user input");
            return;
        }

        // Set system state to 'thinking' and stop listening
        setConversationState((prevState) => ({
            ...prevState,
            status: 'thinking',
            transcribedText,
        }));

        stopListening(); // Stop listening during processing

        try {
            const { value: responsePromise } = generatorRef.current.next(transcribedText);

            if (responsePromise instanceof Promise) {
                const response = await responsePromise;
                console.log(response);
                if (!response){
                    return;
                }
                // Set system state to 'talking' and speak the response
                setConversationState({
                    status: 'talking',
                    transcribedText,
                    speakingText: response,
                });

                await voiceManager.enqueueText(response);  // Speak out the response

                // After speaking, set system state back to 'listening' and resume listening
                setConversationState((prevState) => ({
                    ...prevState,
                    status: 'listening',
                    speakingText: null,
                }));

                resumeListening();  // Resume listening after a short buffer
            } else if (typeof responsePromise === 'string') {
                // Handle predefined messages like initial questions
                setConversationState({
                    status: 'talking',
                    transcribedText,
                    speakingText: responsePromise,
                });

                await voiceManager.enqueueText(responsePromise);  // Speak out the response

                // Set system state back to 'listening' and resume listening
                setConversationState((prevState) => ({
                    ...prevState,
                    status: 'listening',
                    speakingText: null,
                }));

                resumeListening();  // Resume listening after a short buffer
            } else {
                console.error("Expected a Promise or string from the generator but got:", responsePromise);
            }
        } catch (error) {
            console.error("Error processing conversation:", error);
            setConversationState({
                status: 'error',
                transcribedText,
                speakingText: "There was an issue processing your request.",
            });
        }
    }, [audioToText, voiceManager, stopListening, resumeListening]);

    // Function to start the conversation
    const startConversation = useCallback(() => {
        setConversationState({ status: 'listening' });

        if (!generatorRef.current) {
            generatorRef.current = gptFlowGenerator(); // Initialize the generator
        }

        const { value: initialMessage } = generatorRef.current.next(); // Get the first question/message

        if (typeof initialMessage === 'string') {
            voiceManager.enqueueText(initialMessage).then(() => {
                resumeListening(); // Allow listening after initial message
            });
        } else {
            console.error("Expected a string for the initial message but got:", initialMessage);
        }
    }, [voiceManager, processTranscribedText, resumeListening]);

    // Function to stop the conversation
    const stopConversation = useCallback(() => {
        audioToText.stopRecognition();
        voiceManager.stopSpeech();
        setConversationState({
            status: 'idle',
            transcribedText: null,
            speakingText: null,
        });
    }, [audioToText, voiceManager]);

    return { conversationState, startConversation, stopConversation };
};

export default useConvo;