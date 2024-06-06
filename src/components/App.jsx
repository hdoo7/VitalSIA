import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import SliderDrawer from './SliderDrawer';
import { useUnityState } from '../unityMiddleware';
import AnimationManager from '../VISOS/effectors/visualizers/AnimationManager';
import { loopRandomBlink, smile } from '../VISOS/effectors/visualizers/facialExpressions';
import faceMaker from '../faceMaker';
import { ActionUnitsList } from '../unity/facs/shapeDict';
import { useToast } from '@chakra-ui/react'; // Assuming Chakra UI for toast notifications
import GameText from './GameText';
import FaceDetection from './FaceDetection';
import Survey from './Survey'; // Import the Survey component
import { questions } from './utils/freeFormSurveyQuestions'; // Import your survey questions
import { saveToFirebase } from './utils/firebaseUtils'; // Ensure this is correctly imported
import SpeechManager from '../VISOS/effectors/verbalizers/SpeechManager'; // Import the SpeechManager
import CameraControl from '../VISOS/effectors/visualizers/CameraControl'; // Import CameraControl
import CameraInputControl from '../VISOS/effectors/visualizers/CameraInputControl'; // Import CameraInputControl


function App() {
    const { isLoaded, engine, facslib } = useUnityState();
    const [auStates, setAuStates] = useState(ActionUnitsList.reduce((acc, au) => ({
        ...acc, [au.id]: { intensity: 0, name: au.name, notes: "" },
    }), {}));
    const [animationManager, setAnimationManager] = useState(null);
    const [setupComplete, setSetupComplete] = useState(false);
    const [drawerControls, setDrawerControls] = useState({
        isOpen: false, showUnusedSliders: false, cameraEnabled: false,
    });
    const [isSurveyActive, setIsSurveyActive] = useState(false);
    const [isRequestLoading, setRequestIsLoading] = useState(false); // Add this state
    const toast = useToast();

    useEffect(() => {
        if (isLoaded && facslib && !animationManager) {
            const manager = new AnimationManager(facslib, setAuStates);
            const speak = new SpeechManager(manager);
            const cameraControl = new CameraControl(engine); // Initialize CameraControl
            const cameraInputControl = new CameraInputControl(cameraControl);
            setAnimationManager(manager);
            loopRandomBlink(manager);
            faceMaker(manager, setIsSurveyActive, toast, setRequestIsLoading, speak);
            setSetupComplete(true);
            toast({ title: `To begin, just say "Hey Amy show me" and then desribe what you would like to see the agent "act out".`, status: "success" });
        }
    }, [isLoaded, facslib]);

    const handleSurveyComplete = async (responses) => {
        console.log("Survey responses:", responses);
        setIsSurveyActive(false); // Deactivate the survey
        const dataToSave = {
            responses,
            actionUnits: auStates, // Collecting current states of all AUs
            overallFeedback: "Overall feedback from the session", // Placeholder, add actual feedback
            notes: "Detailed notes on session or AUs" // Placeholder, add specific notes
        };
        // Now saving directly and handling toasts within saveToFirebase
        saveToFirebase('FreeForm', dataToSave, toast);
        animationManager.setFaceToNeutral(750); // Reset the face to neutral
    };

    return (
        <div className="App">
            {/* <Loader isLoading={!isLoaded || !setupComplete} /> */}
            {isLoaded && setupComplete && animationManager && (
                <>
                    <p>Unity has loaded, and setup is complete. You can now interact with the Unity content.</p>
                    <SliderDrawer
                        auStates={auStates}
                        setAuStates={setAuStates}
                        animationManager={animationManager}
                        drawerControls={drawerControls}
                        setDrawerControls={setDrawerControls}
                    />
                    {isRequestLoading && (<GameText />) }
                    {/* {isSurveyActive && (
                        <Survey
                            questions={questions}
                            onSurveyComplete={handleSurveyComplete}
                        />
                    )} */}
                </>
            )}
        </div>
    );
}

export default App;