import { useState, useCallback, useRef } from 'react';
import ConversationManager from './../VISOS/cognition/ConversationManager'; // Import base ConversationManager

const useConvo = (audioToText, voiceManager, conversationManager, textToSpeakGen, transcribedTextGen) => {
    const [conversationState, setConversationState] = useState({
        status: 'idle',  // Possible statuses: 'idle', 'listening', 'thinking', 'talking'
        transcribedText: null,  // User's transcribed input
        speakingText: null,  // Text currently being spoken
    });

    const transcribedTextIterator = useRef(transcribedTextGen).current;
    const textToSpeakIterator = useRef(textToSpeakGen).current;

    // Function to handle speaking text from the generator
    const handleSpeakingText = useCallback(async (text) => {
        if (!text || text.trim() === '') {
            console.warn("No text to speak, skipping enqueueText.");
            setConversationState((prev) => ({
                ...prev,
                status: 'listening',
                speakingText: null,
            }));
            return;
        }

        setConversationState((prev) => ({
            ...prev,
            status: 'talking',
            speakingText: text,  // Update state to reflect the speaking text
        }));

        // Use voiceManager to speak the text
        await voiceManager.enqueueText(text);

        // After speaking, transition to listening for the next input
        setConversationState((prev) => ({
            ...prev,
            status: 'listening',
            speakingText: null,  // Clear the speaking text
        }));
        startListening();  // Start listening after speaking
    }, [voiceManager]);

    // Function to process the user's transcribed input
    const processTranscribedText = useCallback((transcribedText) => {
        setConversationState((prev) => ({
            ...prev,
            status: 'thinking',
            transcribedText,  // Save the transcribed text in state
        }));

        // Get the next feedback from the transcribedTextGenerator
        const { value: feedback } = transcribedTextIterator.next(transcribedText);

        // Speak the feedback (Correct / Incorrect) and proceed
        if (feedback) {
            handleSpeakingText(feedback).then(() => {
                // After giving feedback, move to the next question
                const { value: nextQuestion } = textToSpeakIterator.next();
                if (nextQuestion) {
                    handleSpeakingText(nextQuestion);  // Trigger the next question after feedback
                } else {
                    setConversationState((prev) => ({
                        ...prev,
                        status: 'idle',
                        speakingText: null,
                    }));
                }
            });
        }
    }, [handleSpeakingText, transcribedTextIterator, textToSpeakIterator]);

    // Function to start listening for user input
    const startListening = useCallback(() => {
        setConversationState((prev) => ({ ...prev, status: 'listening' }));

        // Start continuous speech recognition and handle the transcribed text
        audioToText.startContinuousRecognition((transcribedText) => {
            processTranscribedText(transcribedText);
        });
    }, [audioToText, processTranscribedText]);

    // Function to start the conversation
    const startConversation = useCallback(async () => {
        // Get the first question from the textToSpeakGenerator
        const { value: firstQuestion } = textToSpeakIterator.next();

        setConversationState((prev) => ({
            ...prev,
            status: 'talking',
            speakingText: firstQuestion,
        }));

        // Speak the first question
        await voiceManager.enqueueText(firstQuestion);

        // After the question, transition to listening
        setConversationState((prev) => ({ ...prev, status: 'listening', speakingText: null }));
        startListening();
    }, [voiceManager, startListening, textToSpeakIterator]);

    // Function to stop the conversation (clean up)
    const stopConversation = useCallback(() => {
        audioToText.stopRecognition();
        voiceManager.stopSpeech();
        setConversationState({ status: 'idle', transcribedText: null, speakingText: null });
    }, [audioToText, voiceManager]);

    // Return conversation state and control methods
    return { conversationState, startConversation, stopConversation };
};

export default useConvo;