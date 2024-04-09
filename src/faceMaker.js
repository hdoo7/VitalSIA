// Import the SpeechProcessor and other necessary components
import SpeechProcessor from './VISOS/sensors/audio/SpeechProcessor';
import TextToGptReconciler from './VISOS/reconcilers/TextToGptReconciler';
import faces from './prompts/faces';
import { headUp, headDown } from './VISOS/effectors/visualizers/facialExpressions';

// TextToGptReconciler instance for processing text with GPT
const gptReconciler = new TextToGptReconciler();

// faceMaker function that integrates SpeechProcessor with animationManager and other components
const faceMaker = (animationManager, setIsRequestLoading, toast) => {
  // Get an instance of SpeechManager, assuming it requires animationManager for initialization
  
  // Define trigger phrases and create a SpeechProcessor instance
  const triggerPhrases = ['amy show me', 'set face to neutral'];
  const speechProcessor = new SpeechProcessor(triggerPhrases.join('|'), (text) => {
    console.log(`Detected text: ${text}`);
    headDown(animationManager);
    animationManager.setFaceToNeutral();
    // Check for specific commands or phrases and respond accordingly
    if (text.toLowerCase().includes('set face to neutral')) {
      console.log("Setting face to neutral.");
      
      toast({
        title: "Face reset to neutral.",
        description: "All action units have been reset.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      headUp(animationManager);
      return;
    }
    let t = toast({
      title: "Detected Text",
      description: text,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    setIsRequestLoading(true);
    gptReconciler.processText(text, faces)
      .then(gptResponse => {
        console.log(`GPT Response: ${gptResponse}`);
        const parsed = JSON.parse(gptResponse);
        animationManager.applyChangesFromJson(JSON.stringify(parsed.aus)); // Apply facial expression changes t
        toast.close();
      })
      .catch(error => console.error("Error in GPT reconciliation:", error))
      .finally(() => {
        headUp(animationManager);
      setIsRequestLoading(false);
    });
  });

  // Start the speech recognition process
  console.log("Starting speech recognition...");
  speechProcessor.start();
};

export default faceMaker;

