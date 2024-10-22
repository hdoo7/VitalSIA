import { useState, useCallback, useRef } from 'react';
import ConversationManager from './../VISOS/cognition/ConversationManager'; 

const useConvo = (audioToText, voiceManager, conversationManager, textToSpeakGen, transcribedTextGen) => {
    const [conversationState, setConversationState] = useState({
        status: 'idle',
        transcribedText: null,
        speakingText: null,
    });

    // Invoke the generator functions to create iterators
    const transcribedTextIterator = useRef(transcribedTextGen()).current;
    const textToSpeakIterator = useRef(textToSpeakGen()).current;

    const handleSpeakingText = useCallback(async (text) => {
        if (!text || text.trim() === '') {
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
            speakingText: text,
        }));

        await voiceManager.enqueueText(text);

        setConversationState((prev) => ({
            ...prev,
            status: 'listening',
            speakingText: null,
        }));
        startListening();
    }, [voiceManager]);

    const processTranscribedText = useCallback((transcribedText) => {
        setConversationState((prev) => ({
            ...prev,
            status: 'thinking',
            transcribedText,
        }));

        // Get the next feedback from the transcribedTextGenerator
        const { value: feedback } = transcribedTextIterator.next(transcribedText);

        if (feedback) {
            handleSpeakingText(feedback).then(() => {
                const { value: nextQuestion } = textToSpeakIterator.next();  // Iterate the generator
                if (nextQuestion) {
                    handleSpeakingText(nextQuestion);
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

    const startListening = useCallback(() => {
        setConversationState((prev) => ({ ...prev, status: 'listening' }));

        audioToText.startContinuousRecognition((transcribedText) => {
            processTranscribedText(transcribedText);
        });
    }, [audioToText, processTranscribedText]);

    const startConversation = useCallback(async () => {
        const { value: firstQuestion } = textToSpeakIterator.next();

        setConversationState((prev) => ({
            ...prev,
            status: 'talking',
            speakingText: firstQuestion,
        }));

        await voiceManager.enqueueText(firstQuestion);

        setConversationState((prev) => ({ ...prev, status: 'listening', speakingText: null }));
        startListening();
    }, [voiceManager, startListening, textToSpeakIterator]);

    const stopConversation = useCallback(() => {
        audioToText.stopRecognition();
        voiceManager.stopSpeech();
        setConversationState({ status: 'idle', transcribedText: null, speakingText: null });
    }, [audioToText, voiceManager]);

    return { conversationState, startConversation, stopConversation };
};

export default useConvo;