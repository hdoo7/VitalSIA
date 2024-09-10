import AudioToText from './VISOS/perception/audio/AudioToText';
import TextToListenerWithFollowUp from './VISOS/perception/audio/TextToListenerWithFollowUp';
import TextToGptReconciler from './VISOS/cognition/TextToGptReconciler';
import SpeechManager from './VISOS/action/verbalizers/SpeechManager';
import AnimationManager from './VISOS/action/visualizers/AnimationManager';


const audioToText = new AudioToText();
const textToListener = new TextToListenerWithFollowUp(['Hey Amy']);
const gptReconciler = new TextToGptReconciler();


const heyAmy = ((engine, facslib) => {
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
            if (!detectedPhrase.debounceText){
                return;
            }
            
            return gptReconciler.processText(detectedPhrase.debounceText, "Answer in a serious way:");
            
        })
        .catch((e)=>console.log(e))
        .then(gptResponse => {
            if (gptResponse) {
                console.log(`GPT Response: ${gptResponse}`);
                speechManager.enqueueText(gptResponse);
       
            }
        })
        .catch(error => {
            console.error("Error in processing:", error);
        });
    };
    setTimeout(()=>loop(), 30)
})
export default heyAmy;
