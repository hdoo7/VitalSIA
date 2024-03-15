import AudioToText from './VISOS/sensors/audio/AudioToText';
import TextToListenerWithFollowUp from './VISOS/sensors/audio/TextToListenerWithFollowUp';
import TextToGptReconciler from './VISOS/reconcilers/TextToGptReconciler';
import SpeechManager from './VISOS/effectors/verbalizers/SpeechManager';
import AnimationManager from './VISOS/effectors/visualizers/AnimationManager';
import faces from './prompts/faces'
import { headUp, headDown } from './VISOS/effectors/visualizers/facialExpressions'

const audioToText = new AudioToText();
const textToListener = new TextToListenerWithFollowUp(['amy show me', 'set face to neutral']);
const gptReconciler = new TextToGptReconciler();


const faceMaker = ((engine, facslib) => {
    const animationManager = new AnimationManager(facslib)
    const speechManager = SpeechManager.getInstance(animationManager);
    console.log("Starting audio transcription...");
    const loop = () => { 
        audioToText.startContinuousRecognition()
        .then(text => {
            console.log(`Transcribed text: ${text}`);
            return textToListener.listen(text);
        })
        .then((detectedPhrase) => {
            setTimeout(()=>loop(), 3000)
            console.log(detectedPhrase);
            headDown(animationManager);
            if (!detectedPhrase.debounceText && detectedPhrase.detectedPhrase === 'set face to neutral') {
                console.log("xxx");
                animationManager.setFaceToNeutral();
                return;
            }
            if (!detectedPhrase || !detectedPhrase.debounceText){
                return;
            }
            
            return gptReconciler.processText(detectedPhrase.debounceText, faces);
            
        })
        .catch((e)=>console.log(e))
        .then(gptResponse => {
            if (gptResponse) {
                console.log(`GPT Response: ${gptResponse}`);
                const parsed = JSON.parse(gptResponse);
                speechManager.enqueueText(parsed.explanation);
                animationManager.applyChangesFromJson(JSON.stringify(parsed.aus))
            }
        })
        .catch(error => {
            console.error("Error in processing:", error);
        }).finally(()=> headUp(animationManager));
    };
    setTimeout(()=>loop(), 30)
})
export default faceMaker;
