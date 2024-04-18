import TextToGptReconciler from './VISOS/reconcilers/TextToGptReconciler';
import { headUp, headDown } from './VISOS/effectors/visualizers/facialExpressions';
import faces from './prompts/faces';

const gptReconciler = new TextToGptReconciler();

const faceLoader = (prompt, animationManager, setIsSurveyActive, setRequestIsLoading, toast) => {
    console.log(`Received prompt: ${prompt}`);
    headDown(animationManager);
    animationManager.setFaceToNeutral();
    setRequestIsLoading(true);

    if (prompt.toLowerCase() === 'set face to neutral') {
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
        title: "Processing Text",
        description: `Processing prompt: ${prompt}`,
        status: "info",
        duration: 3000,
        isClosable: true,
    });

    gptReconciler.processText(prompt, faces)
        .then(gptResponse => {
            console.log(`GPT Response: ${gptResponse}`);
            const parsed = JSON.parse(gptResponse);
            animationManager.applyChangesFromJson(JSON.stringify(parsed.aus)); // Apply facial expression changes
            toast.close(t);
            setRequestIsLoading(false);
            setIsSurveyActive(true); // Activate the survey only here, after processing is complete
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
            setIsSurveyActive(false); // Deactivate survey on error
        })
        .finally(() => {
            headUp(animationManager);
        });
};

export default faceLoader;
