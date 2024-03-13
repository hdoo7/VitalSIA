import AudioToText from './VISOS/sensors/audio/AudioToText';
import TextToListener from './VISOS/sensors/audio/TextToListener';
import { loopSmileAndStickTongueOut } from './VISOS/effectors/visualizers/facialExpressions';
import AnimationManager from './VISOS/effectors/visualizers/AnimationManager';
const audioToText = new AudioToText();
const keyPhrases = ["stick out your tongue"]; // Example keyphrase(s)

// Instantiate the text listener with the key phrases
const labialListener = new TextToListener(keyPhrases);
const labial = (engine, faclib) => {
    const animationManager = new AnimationManager(facslib)
    console.log("Starting audio transcription...");
    audioToText.startContinuousRecognition()
        .then(text => {
            console.log(`Transcribed text: ${text}`);
            console.log("Listening for the key phrase...");
            return labialListener.listen(text); // Pass the current text to the listen method
        })
        .then(detectedPhrase => {
            console.log(`Triggering visual effect for phrase: ${detectedPhrase}`);
            loopSmileAndStickTongueOut(animationManager); // Trigger the visual effect
            console.log("EVA responded with a smile and sticking her tongue out.");
        })
        .catch(error => {
            console.error("Error in processing:", error);
        });
};

export default labial;
