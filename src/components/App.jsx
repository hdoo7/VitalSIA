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
    const [isSurveyActive, setIsSurveyActive] = useState(false); // State to manage survey activity
    const toast = useToast();

    useEffect(() => {
        if (isLoaded && facslib && !animationManager) {
            const manager = new AnimationManager(facslib, setAuStates);
            setAnimationManager(manager);
            loopRandomBlink(manager);
            faceMaker(manager, setIsSurveyActive, toast); // Adjust this to pass setIsSurveyActive
            setSetupComplete(true);
        }
    }, [isLoaded, facslib]);

    const handleSurveyComplete = (responses) => {
        console.log("Survey responses:", responses);
        setIsSurveyActive(false); // Deactivate the survey
        // Add additional logic here, e.g., save responses to Firestore
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
                    <FaceDetection canvasId="#canvas" />
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
