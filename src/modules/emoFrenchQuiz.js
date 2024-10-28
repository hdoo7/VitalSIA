import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client';
import useConvo from './../hooks/useConvo';  // Custom hook
import useDiscreteMirroring from './../hooks/useDiscreteMirroring';  // Continuous emotion mirroring hook
import AudioToText from './../VISOS/perception/audio/AudioToText';
import VoiceManager from './../VISOS/action/verbalizers/VoiceManager';
import TrafficLightIndicator from '../components/TrafficLightIndicator';
import EmotionDetection from '../components/EmotionDetection';  // Emotion detection component

let root = null;

const QuizApp = ({ animationManager }) => {
    const [correctAnswers, setCorrectAnswers] = useState(0); // Track correct answers
    const [emotionState, setEmotionState] = useState(null);  // Track emotionState for mirroring
    const correctAnswersRef = useRef(correctAnswers); // Ref to store correctAnswers value
    const quizFlowRef = useRef(null);  // Ref to store the quiz flow generator
    const toast = useToast();

    // Update correctAnswersRef whenever correctAnswers state changes
    useEffect(() => {
        correctAnswersRef.current = correctAnswers; // Keep the ref in sync with the state
    }, [correctAnswers]);

    // Generator logic to be managed via useRef
    const quizFlowGenerator = useMemo(() => {
        return function* () {
            const questions = [
                { french: "Bonjour", english: "Hello" },
                { french: "Merci", english: "Thank you" },
                { french: "Chat", english: "Cat" },
                { french: "Tête", english: "Head" },
                { french: "Maison", english: "House" },
            ];

            const response = yield `Bonjour!`;
            if (response == `hello`){
                let userAnswer = yield `Que veut dire ${questions[0].french} en anglais ?`;  // Ask the question

                for (let i = 0; i < questions.length; i++) {
                    const question = questions[i];
                    
                    // Provide feedback based on the answer
                    if (userAnswer && userAnswer.toLowerCase().includes(question.english.toLowerCase())) {
                        setCorrectAnswers((prev) => prev + 1); // Increment correct answers
                        userAnswer = yield `Correct! Que veut dire ${questions[i + 1]?.french || 'vous avez terminé'} en anglais ?`;
                    } else {
                        userAnswer = yield `Incorrect. La réponse correcte est: ${question.english}. Que veut dire ${questions[i + 1]?.french || 'vous avez terminé'} en anglais ?`;
                    }
                }
    
                // Final message after all questions
                yield `Vous avez terminé le quiz! Vous avez obtenu ${correctAnswersRef.current} bonnes réponses sur ${questions.length}. Merci d'avoir participé!`;
            } else {
                yield `How very rude!`
            }

        };
    }, []);  // Empty dependency array ensures the generator is created only once

    const audioToText = useRef(new AudioToText('webspeech')).current; // Use useRef to keep the same instance
    const voiceManager = useRef(VoiceManager.getInstance(animationManager)).current; // Same for voiceManager

    // Integrate Emotion Mirroring Hook
    useDiscreteMirroring(animationManager, emotionState);  // Use continuous emotion mirroring

    const { conversationState, startConversation, stopConversation } = useConvo(
        audioToText, 
        voiceManager, 
        () => quizFlowRef.current  // Pass the generator stored in ref
    );

    useEffect(() => {
        // Set the generator in the ref when initializing
        if (!quizFlowRef.current) {
            quizFlowRef.current = quizFlowGenerator();
        }

        voiceManager.findAndSetVoice('Google français').then(() => {
            startConversation();
        });

        return () => {
            stopConversation();
        };
    }, [startConversation, stopConversation, voiceManager, quizFlowGenerator]);

    useEffect(() => {
        if (conversationState.status === 'talking') {
            toast({
                title: 'Response',
                description: conversationState.speakingText,
                status: 'success',
                duration: 4000,
            });
        }
    }, [conversationState.status, conversationState.speakingText, toast]);

    return (
        <div>
            <EmotionDetection onEmotionStateChange={setEmotionState} />  
            <TrafficLightIndicator status={conversationState.status} />
            <div>
                <h1 style={{fontSize:`33px`}}>Correct Answers: {correctAnswers}</h1>
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