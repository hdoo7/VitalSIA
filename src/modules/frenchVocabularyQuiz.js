import ReactDOMClient from 'react-dom/client';
import React, { useEffect } from 'react';
import AudioToText from './../VISOS/perception/audio/AudioToText';
import VoiceManager from './../VISOS/action/verbalizers/VoiceManager';

let voiceManager = null;
let audioToText = null;
let currentQuestionIndex = 0;
let correctAnswers = 0;
let root = null;

let questions = [
    { french: "Bonjour", english: "Hello" },
    { french: "Merci", english: "Thank you" },
    { french: "Chat", english: "Cat" },
    { french: "Chien", english: "Dog" },
    { french: "Maison", english: "House" },
];

// Function to set the voice to French and ensure it's available
const setFrenchVoice = () => {
    return new Promise((resolve) => {
        console.log("Attempting to set the voice to French...");
        const checkVoices = () => {
            const frenchVoice = voiceManager.getVoices().find(voice => voice.name.includes("Google français"));
            if (frenchVoice) {
                voiceManager.setVoice(frenchVoice.name);
                console.log(`French voice set: ${frenchVoice.name}`);
                resolve();
            } else {
                console.log("French voice not found, retrying...");
                setTimeout(checkVoices, 500);  // Retry until the voice is available
            }
        };
        checkVoices();
    });
};

// Function to ask the next question
const askNextQuestion = () => {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        const questionText = `Que veut dire ${currentQuestion.french} en anglais ?`;
        console.log(`Asking question: ${questionText}`);
        voiceManager.enqueueText(questionText);

        // Wait for the question to be spoken before starting to listen
        voiceManager.synthesizeSpeech(questionText).then(() => {
            console.log("Question spoken. Starting to listen for an answer...");
            audioToText.startContinuousRecognition((transcribedText) => {
                processAnswer(transcribedText);
            });
        });
    } else {
        endQuiz();
    }
};

// Function to process the user's answer
const processAnswer = (transcribedText) => {
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = transcribedText.trim().toLowerCase();
    const correctAnswer = currentQuestion.english.toLowerCase();

    console.log(`User answered: ${userAnswer}`);

    if (userAnswer === correctAnswer) {
        correctAnswers++;
        console.log("Correct answer!");
        voiceManager.enqueueText("Correct !");
    } else {
        console.log(`Incorrect answer. The correct answer is: ${currentQuestion.english}`);
        voiceManager.enqueueText(`Incorrect. La bonne réponse est ${currentQuestion.english}`);
    }

    currentQuestionIndex++;
    askNextQuestion();  // Move to the next question
};

// Function to end the quiz
const endQuiz = () => {
    console.log(`Quiz ended. You got ${correctAnswers} out of ${questions.length} correct.`);
    voiceManager.enqueueText(`Vous avez terminé le quiz ! Vous avez obtenu ${correctAnswers} bonnes réponses sur ${questions.length}.`);
};

// React component for FrenchQuizApp
const FrenchQuizApp = () => {
    useEffect(() => {
        console.log("Starting French quiz...");
        audioToText.startContinuousRecognition((text) => askNextQuestion());

        return () => {
            console.log("Stopping recognition...");
            audioToText.stopRecognition();  // Clean up when component unmounts
        };
    }, []);

    return null; // No need for a visible UI component
};

// Start the quiz
export const start = (animationManager) => {
    console.log("Initializing French Vocabulary Quiz...");
    voiceManager = VoiceManager.getInstance(animationManager);
    audioToText = new AudioToText('webspeech');  // Initialize AudioToText
    currentQuestionIndex = 0;
    correctAnswers = 0;

    setFrenchVoice().then(() => {
        console.log("Starting the quiz with the first question...");
        voiceManager.enqueueText("Commençons le quiz de vocabulaire en français !");
        askNextQuestion();  // Ask the first question
    });
};

// Stop the quiz
export const stop = () => {
    console.log("Stopping French Vocabulary Quiz...");
    if (audioToText) {
        audioToText.stopRecognition();
    }
    if (voiceManager) {
        voiceManager.stopSpeech();
    }
    console.log("Quiz stopped.");
};