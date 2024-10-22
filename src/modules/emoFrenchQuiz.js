import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client';
import useConvo from './../hooks/useConvo';  // Custom hook
import useMirroring from './../hooks/useMirroring';  // Continuous emotion mirroring hook
import AudioToText from './../VISOS/perception/audio/AudioToText';
import VoiceManager from './../VISOS/action/verbalizers/VoiceManager';
import ConversationManager from './../VISOS/cognition/ConversationManager';
import TrafficLightIndicator from '../components/TrafficLightIndicator';
import EmotionDetection from '../components/EmotionDetection';  // Emotion detection component

let root = null;

const QuizApp = ({ animationManager }) => {
    const [correctAnswers, setCorrectAnswers] = useState(0); // Track correct answers
    const [emotionState, setEmotionState] = useState(null);  // Track emotionState for mirroring
    const correctAnswersRef = useRef(correctAnswers); // Ref to store correctAnswers value
    const toast = useToast();

    const questions = useMemo(() => [
        { french: "Bonjour", english: "Hello" },
        { french: "Merci", english: "Thank you" },
        { french: "Chat", english: "Cat" },
        { french: "Tet", english: "Head" },
        { french: "Maison", english: "House" },
    ], []);

    // Update correctAnswersRef whenever correctAnswers state changes
    useEffect(() => {
        correctAnswersRef.current = correctAnswers; // Keep the ref in sync with the state
    }, [correctAnswers]);

    // Memoize the textToSpeakGenerator for questions
    const textToSpeakGenerator = useMemo(() => {
        return function* () {
            for (let question of questions) {
                yield `Que veut dire ${question.french} en anglais ?`;
            }
            // Final message after all questions have been answered using ref to get the latest value
            yield `Vous avez terminé le quiz! Vous avez obtenu ${correctAnswersRef.current} bonnes réponses sur ${questions.length}. Merci d'avoir participé!`;
        };
    }, [questions]);

    // Memoize the transcribedTextGenerator for checking answers
    const transcribedTextGenerator = useMemo(() => {
        return function* () {
            for (let question of questions) {
                const userAnswer = yield;  // Get user input
                if (userAnswer.toLowerCase().includes(question.english.toLowerCase())) {
                    setCorrectAnswers((prev) => prev + 1); // Increment correct answers
                    yield "Correct!";
                } else {
                    yield `Incorrect. La réponse correcte est: ${question.english}`;
                }
            }
        };
    }, [questions]);

    const [conversationState, setConversationState] = useState({
        status: 'idle', // Possible statuses: 'idle', 'listening', 'thinking', 'talking'
        transcribedText: null, // User's transcribed input
        speakingText: null, // Text currently being spoken
    });

    const audioToText = useRef(new AudioToText('webspeech')).current;
    const voiceManager = useRef(VoiceManager.getInstance(animationManager)).current;
    const conversationManager = useRef(new ConversationManager(1000, audioToText, voiceManager)).current;

    // Integrate Emotion Mirroring Hook
    useMirroring(animationManager, emotionState);  // Use continuous emotion mirroring

    const { startConversation, stopConversation } = useConvo(
        audioToText,
        voiceManager,
        conversationManager,
        textToSpeakGenerator,
        transcribedTextGenerator
    );

    useEffect(() => {
        voiceManager.findAndSetVoice('Google français').then(() => {
            startConversation();
        });

        return () => {
            stopConversation();
        };
    }, [startConversation, stopConversation, voiceManager]);

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
                description: conversationState.speakingText,
                status: 'success',
                duration: 4000,
            });
        }
    }, [conversationState.status, toast]);

    return (
        <div>
            <EmotionDetection onEmotionStateChange={setEmotionState} />  {/* Emotion Detection */}
            <TrafficLightIndicator status={conversationState.status} />
            <div>
                <h2>Correct Answers: {correctAnswers}</h2>
            </div>
        </div>
    );
};

// Start and Stop the quiz functions
export const start = (animationManager, appSettings, containerRef) => {
    if (!containerRef || !containerRef.current) {
        console.error('Invalid container reference');
        return;
    }

    if (!root) {
        root = createRoot(containerRef.current);
    }

    root.render(<QuizApp animationManager={animationManager} />);
};

export const stop = () => {
    console.log("Stopping French Vocabulary Quiz...");
    if (root) {
        root.unmount();
        root = null;
    }
};