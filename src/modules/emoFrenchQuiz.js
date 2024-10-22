import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client';
import useConvo from './../hooks/useConvo';
import useMirroring from './../hooks/useMirroring';  // Continuous emotion mirroring hook
import AudioToText from './../VISOS/perception/audio/AudioToText';
import VoiceManager from './../VISOS/action/verbalizers/VoiceManager';
import ConversationManager from './../VISOS/cognition/ConversationManager';
import TrafficLightIndicator from '../components/TrafficLightIndicator';
import EmotionDetection from '../components/EmotionDetection';  // Emotion detection component

let root = null;

const EmoFrenchQuiz = ({ animationManager }) => {
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [emotionState, setEmotionState] = useState(null);  // Store emotionState from EmotionDetection
    const toast = useToast();
    
    // Pass the emotionState to the useMirroring hook
    useMirroring(animationManager, emotionState);  // Pass emotionState to the mirroring hook

    const questions = useMemo(() => [
        { french: "Bonjour", english: "Hello" },
        { french: "Merci", english: "Thank you" },
        { french: "Chat", english: "Cat" },
        { french: "Tet", english: "Head" },
        { french: "Maison", english: "House" },
    ], []);

    const textToSpeakGenerator = useMemo(() => {
        return function* () {
            for (let question of questions) {
                yield `Que veut dire ${question.french} en anglais ?`;
            }
            yield `Vous avez terminé le quiz! Vous avez obtenu ${correctAnswers} bonnes réponses sur ${questions.length}.`;
        };
    }, [correctAnswers, questions]);

    const transcribedTextGenerator = useMemo(() => {
        return function* () {
            for (let question of questions) {
                const userAnswer = yield;
                if (userAnswer.toLowerCase().includes(question.english.toLowerCase())) {
                    setCorrectAnswers((prev) => prev + 1);
                    yield "Correct!";
                } else {
                    yield `Incorrect. La réponse correcte est: ${question.english}`;
                }
            }
        };
    }, [questions]);

    const [conversationState, setConversationState] = useState({
        status: 'idle',
        transcribedText: null,
        speakingText: null,
    });

    const audioToText = useRef(new AudioToText('webspeech')).current;
    const voiceManager = useRef(VoiceManager.getInstance(animationManager)).current;
    const conversationManager = useRef(new ConversationManager(1000, audioToText, voiceManager)).current;

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
            <EmotionDetection onEmotionStateChange={setEmotionState} />  {/* Pass emotion state to the detection */}
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

    root.render(<EmoFrenchQuiz animationManager={animationManager} />);
};

export const stop = () => {
    console.log("Stopping French Vocabulary Quiz...");
    if (root) {
        root.unmount();
        root = null;
    }
};