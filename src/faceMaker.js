import SpeechProcessor from './VISOS/sensors/audio/SpeechProcessor';
import TextToGptReconciler from './VISOS/reconcilers/TextToGptReconciler';
import faces from './prompts/faces';
import { headUp, headDown } from './VISOS/effectors/visualizers/facialExpressions';

const gptReconciler = new TextToGptReconciler();

const faceMaker = (animationManager, setRequestIsLoading, toast, ) => {
    const triggerPhrases = ['amy show me', 'set face to neutral'];
    const speechProcessor = new SpeechProcessor(triggerPhrases.join('|'), (text) => {
        console.log(`Detected text: ${text}`);
        headDown(animationManager);
        animationManager.setFaceToNeutral();
        setRequestIsLoading(true);
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

        gptReconciler.processText(text, faces)
            .then(gptResponse => {
                console.log(`GPT Response: ${gptResponse}`);
                const parsed = JSON.parse(gptResponse);
                animationManager.applyChangesFromJson(JSON.stringify(parsed.aus)); // Apply facial expression changes
                toast.close(t);
                setRequestIsLoading(false);
                 // Activate the survey only here, after processing is complete
            })
            .catch(error => {
                console.error("Error in GPT reconciliation:", error);
                toast.close(t);
                toast({
                    title: "Error Processing Request",
                    description: "Failed to process your request. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                 // Deactivate survey on error
            })
            .finally(() => {
                headUp(animationManager);
            });
    });

    // Start the speech recognition process
    console.log("Starting speech recognition...");
    speechProcessor.start();
};

export default faceMaker;
