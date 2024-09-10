import SpeechProcessor from './VISOS/perception/audio/SpeechProcessor';
import TextToGptReconciler from './VISOS/cognition/TextToGptReconciler';
import faces from './prompts/faces';
import { headUp, headDown } from './VISOS/action/visualizers/facialExpressions';

const gptReconciler = new TextToGptReconciler();

const faceMaker = (animationManager, setIsSurveyActive, toast, setRequestIsLoading, speak) => {
    const triggerPhrases = ['amy show me', 'amy please explain', 'set face to neutral'];
    const speechProcessor = new SpeechProcessor(triggerPhrases.join('|'), (text) => {
        console.log(`Detected text: ${text}`);
        animationManager.setFaceToNeutral();
        
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

        if (text.toLowerCase().includes('amy please explain')) {
            toast({
                title: "Explaining in progress.",
                description: "Please listen closely.",
                status: "info",
                duration: 90000,
                isClosable: true,
            });
            speak.enqueueText(`Given the stringent requirements for supporting research, this project has gone through several iterations to determine what survey configuration works best. .....The chosen strategy combines two parts of the survey: ....First... there  is a free form version that allows participants to  illicit their own faicial expressions from the E EVA, ....And second... there is another survey that uses current theories of appraisal that include big 5 traits in the analysis of micro expressions........... The goal is to determine the best way to elicit facial expressions from the LLM-connected E. Eva, and to determine the best way to analyze those expressions. Both of these Surveys will be done in the form of a user study.. wherein after completing the study participants feedback on the system and how they found the usability aspect. Hopefully in future iterations this could be crowd sourced on mechanical turk.`);
            return;
        }
        setRequestIsLoading(true);
        let t = toast({
            title: "Detected Text",
            description: text,
            status: "info",
            duration: 3000,
            isClosable: true,
        });
        setRequestIsLoading(true);
        gptReconciler.processText(text, faces)
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
    });

    // Start the speech recognition process
    console.log("Starting speech recognition...");
    speechProcessor.start();
};

export default faceMaker;