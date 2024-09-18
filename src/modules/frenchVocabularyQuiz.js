import AudioToText from './../VISOS/perception/audio/AudioToText';
import VoiceManager from './../VISOS/action/verbalizers/VoiceManager';
import ConversationManager from './../VISOS/cognition/ConversationManager'; // Updated import

let voiceManager = null;
let audioToText = null;
let conversationManager = null;
let currentQuestionIndex = 0;
let correctAnswers = 0;

let questions = [
    { french: "Bonjour", english: "Hello" },
    { french: "Merci", english: "Thank you" },
    { french: "Chat", english: "Cat" },
    { french: "Tet", english: "Head" },
    { french: "Maison", english: "House" },
];

// Function to ask the next question
const askNextQuestion = (setStatus) => {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        const questionText = `Que veut dire ${currentQuestion.french} en anglais ?`;

        setStatus('talking');
        voiceManager.enqueueText(questionText).then(() => {
            setStatus('listening');
            console.log("Listening for user response...");
            // Using promise-based startListening instead of a callback
            conversationManager.startListening().then((transcribedText) => {
                processAnswer(transcribedText, setStatus);
            }).catch((error) => {
                console.error("Error during listening:", error);
            });
        });
    } else {
        endQuiz(setStatus);
    }
};

// Function to process the user's answer
const processAnswer = (transcribedText, setStatus) => {
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = transcribedText.trim().toLowerCase();
    const correctAnswer = currentQuestion.english.toLowerCase();

    console.log(`User answered: ${userAnswer}`);

    if (userAnswer.includes(correctAnswer)) {
        correctAnswers++;
        console.log("Correct!");
        voiceManager.enqueueText("Correct !");
    } else {
        console.log(`Incorrect. The correct answer is: ${currentQuestion.english}`);
        voiceManager.enqueueText(`Incorrect. La réponse correcte est: ${currentQuestion.english}`);
    }

    currentQuestionIndex++;
    askNextQuestion(setStatus);  // Move to the next question
};

// Function to end the quiz
const endQuiz = (setStatus) => {
    console.log(`Quiz ended. You got ${correctAnswers} out of ${questions.length} correct.`);
    voiceManager.enqueueText(`Vous avez terminé le quiz ! Vous avez obtenu ${correctAnswers} bonnes réponses sur ${questions.length}.`);
    setStatus('idle');
};

// Start function
export const start = (animationManager) => {
    console.log("Initializing French Vocabulary Quiz...");
    voiceManager = VoiceManager.getInstance(animationManager);
    audioToText = new AudioToText('webspeech');
    conversationManager = new ConversationManager(1000, audioToText, voiceManager); // Pass voiceManager

    currentQuestionIndex = 0;
    correctAnswers = 0;
    voiceManager.findAndSetVoice("Google français").then(() => {
        console.log("Starting the quiz with the first question...");
        voiceManager.enqueueText("Commençons le quiz de vocabulaire en français !");
        askNextQuestion(() => {});  // Start asking questions
    });
};

// Stop function
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