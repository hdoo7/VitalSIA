import AudioToText from 'VISOS/perception/audio/AudioToText';
import TextToListenerWithFollowUp from 'VISOS/perception/audio/TextToListenerWithFollowUp';
import TextToGptReconciler from 'VISOS/cognition/TextToGptReconciler';
import SpeechManager from 'VISOS/action/verbalizers/SpeechManager';
import AnimationManager from 'VISOS/action/visualizers/AnimationManager';

let audioToText;
let textToListener;
let gptReconciler;
let speechManager;

const start = (animationManager, appSettings, containerRef) => {
    // Initialize the necessary instances
    audioToText = new AudioToText();
    textToListener = new TextToListenerWithFollowUp([appSettings.triggerPhrases]);
    gptReconciler = new TextToGptReconciler(appSettings.apiKey);
    speechManager = SpeechManager.getInstance(animationManager);

    // Start the process of listening and responding with GPT
    const loop = () => {
        audioToText.startContinuousRecognition()
            .then(text => {
                console.log(`Transcribed text: ${text}`);
                return textToListener.listen(text);
            })
            .then(detectedPhrase => {
                if (!detectedPhrase || !detectedPhrase.debounceText) {
                    console.log('No detected phrase or debounce text');
                    return;
                }
                return gptReconciler.processText(detectedPhrase.debounceText, 'Answer in a serious way:');
            })
            .then(gptResponse => {
                if (gptResponse) {
                    console.log(`GPT Response: ${gptResponse}`);
                    speechManager.enqueueText(gptResponse);
                }
            })
            .catch(error => {
                console.error('Error in processing:', error);
            })
            .finally(() => {
                // Recursively restart the loop after some delay
                setTimeout(() => loop(), 3000);
            });
    };

    // Start the loop
    loop();
};

const stop = (animationManager) => {
    if (audioToText) {
        audioToText.stopContinuousRecognition();
    }
    if (speechManager) {
        speechManager.stopSpeech();
    }
};

export { start, stop };