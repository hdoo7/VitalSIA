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
import { questions } from './utils/surveyQuestions'; // Import your survey questions
import { saveToFirebase } from './utils/firebaseUtils'; // Ensure this is correctly imported

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
            setAnimationManager(manager);
            loopRandomBlink(manager);
            faceMaker(manager, setIsSurveyActive, toast, setRequestIsLoading);
            setSetupComplete(true);
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
        saveToFirebase('StaticExpressions', dataToSave, toast);
    };

    return (
        <div className="App">
            <Loader isLoading={!isLoaded || !setupComplete} />
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
                    {isSurveyActive && (
                        <Survey
                            questions={questions}
                            onSurveyComplete={handleSurveyComplete}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default App;
