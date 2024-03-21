// Import the SpeechProcessor and other necessary components
import SpeechProcessor from './VISOS/sensors/audio/SpeechProcessor';
import TextToGptReconciler from './VISOS/reconcilers/TextToGptReconciler';
import faces from './prompts/faces';
import { headUp, headDown } from './VISOS/effectors/visualizers/facialExpressions';

// TextToGptReconciler instance for processing text with GPT
const gptReconciler = new TextToGptReconciler();

// faceMaker function that integrates SpeechProcessor with animationManager and other components
const faceMaker = (animationManager) => {
  // Get an instance of SpeechManager, assuming it requires animationManager for initialization
  
  // Define trigger phrases and create a SpeechProcessor instance
  const triggerPhrases = ['amy show me', 'set face to neutral'];
  const speechProcessor = new SpeechProcessor(triggerPhrases.join('|'), (text) => {
    console.log(`Detected text: ${text}`);
    headDown(animationManager);

    // Check for specific commands or phrases and respond accordingly
    if (text.toLowerCase().includes('set face to neutral')) {
      console.log("Setting face to neutral.");
      animationManager.setFaceToNeutral();
      headUp(animationManager);
      return;
    }

    // If text requires GPT processing
    gptReconciler.processText(text, faces)
      .then(gptResponse => {
        console.log(`GPT Response: ${gptResponse}`);
        const parsed = JSON.parse(gptResponse);
        animationManager.applyChangesFromJson(JSON.stringify(parsed.aus)); // Apply facial expression changes
      })
      .catch(error => console.error("Error in GPT reconciliation:", error))
      .finally(() => headUp(animationManager));
  });

  // Start the speech recognition process
  console.log("Starting speech recognition...");
  speechProcessor.start();
};

export default faceMaker;

