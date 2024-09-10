import AudioToText from './../VISOS/perception/audio/AudioToText';
import TextToListenerWithFollowUp from './../VISOS/perception/audio/TextToListenerWithFollowUp'; 
import TextToGptReconciler from './../VISOS/cognition/TextToGptReconciler';
import VoiceManager from './../VISOS/action/verbalizers/VoiceManager';

let audioToText;
let textToListenerWithFollowUp;
let gptReconciler;
let voiceManager;
let conversationStarted = false;  // Track if the conversation has been started

const start = (animationManager, appSettings) => {
    // Initialize the necessary instances
    audioToText = new AudioToText('webspeech');
    textToListenerWithFollowUp = new TextToListenerWithFollowUp([appSettings.triggerPhrases]);
    gptReconciler = new TextToGptReconciler(appSettings.apiKey);
    voiceManager = VoiceManager.getInstance(animationManager);  // Use shared instance

    const handleTranscribedText = (text) => {
        console.log(`Transcribed text: ${text}`);

        textToListenerWithFollowUp.listenForFollowUp(text)
            .then(result => {
                if (!result) {
                    console.log("No follow-up detected. Doing nothing...");
                    return;
                }

                if (result.phrase && !conversationStarted) {
                    conversationStarted = true;
                    console.log(`Trigger phrase detected: ${result.phrase}`);
                    return gptReconciler.processText(result.phrase, 'Answer in a serious way:')
                        .then(gptResponse => {
                            if (gptResponse) {
                                voiceManager.enqueueText(gptResponse);  // Use shared voice manager
                            }
                        });
                }

                if (result.followUp && conversationStarted) {
                    console.log(`Follow-up detected: ${result.followUp}`);
                    return gptReconciler.processText(result.followUp, 'Answer in a serious way:')
                        .then(gptResponse => {
                            if (gptResponse) {
                                voiceManager.enqueueText(gptResponse);  // Use shared voice manager
                            }
                        });
                }
            })
            .catch(error => {
                console.error("Error in recognition or GPT processing:", error);
            });
    };

    // Start continuous recognition
    audioToText.startContinuousRecognition(handleTranscribedText);
};

const stop = () => {
    if (audioToText) {
        audioToText.stopRecognition();
    }
    if (voiceManager) {
        voiceManager.stopSpeech();  // Stop any ongoing speech from the shared voice manager
    }
};

export { start, stop };