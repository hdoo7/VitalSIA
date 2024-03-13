import AudioToText from './VISOS/sensors/audio/AudioToText';
import TextToListener from './VISOS/sensors/audio/TextToListener';
import TextToGptReconciler from './VISOS/reconcilers/TextToGptReconciler';
import SpeechManager from './VISOS/effectors/verbalizers/SpeechManager';

const openAiApiKey = 'your_openai_api_key_here'; // Placeholder API key
const microsoftApiKey = 'your_microsoft_api_key_here'; // Placeholder API key
const microsoftRegion = 'your_microsoft_region_here'; // Placeholder region

const audioToText = new AudioToText(microsoftApiKey, microsoftRegion);
const textToListener = new TextToListener(['Hey Amy']);
const gptReconciler = new TextToGptReconciler(openAiApiKey);
const speechManager = new SpeechManager(microsoftApiKey, microsoftRegion);

const faceMaker = (engine, facslib) => {
    console.log("Starting audio transcription...");
    audioToText.startContinuousRecognition()
        .then(text => {
            console.log(`Transcribed text: ${text}`);
            return textToListener.listen(text);
        })
        .then(detectedPhrase => {
            if (detectedPhrase) {
                console.log(`Detected Phrase: ${detectedPhrase}, fetching response from GPT...");
                return gptReconciler.processText(detectedPhrase, "Generate AU JSON for facial expression from the following text:");
            }
        })
        .then(gptResponse => {
            if (gptResponse) {
                console.log(`GPT Response: ${gptResponse}`);
                speechManager.speak(gptResponse); // Vocalize the GPT response
            }
        })
        .catch(error => {
            console.error("Error in processing:", error);
        });
};

export default faceMaker;
