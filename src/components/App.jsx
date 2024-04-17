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
    const [isRequestLoading, setIsRequestLoading] = useState(false); // State to manage loading of requests

    useEffect(() => {
        if (isLoaded && facslib && !animationManager) {
            const manager = new AnimationManager(facslib, setAuStates);
            setAnimationManager(manager);
            loopRandomBlink(manager);
            faceMaker(manager, setIsSurveyActive, setIsRequestLoading, toast); // Pass setIsRequestLoading to faceMaker
            setSetupComplete(true);
        }
    }, [isLoaded, facslib]);

    const handleSurveyComplete = async (responses) => {
        console.log("Survey responses:", responses);
        setIsSurveyActive(false); // Deactivate the survey
        setIsRequestLoading(false); // Reset request loading state when survey is completed
        const dataToSave = {
            responses,
            actionUnits: auStates, // Collecting current states of all AUs
            overallFeedback: "Overall feedback from the session", // Placeholder, add actual feedback
            notes: "Detailed notes on session or AUs" // Placeholder, add specific notes
        };
        // Now saving directly and handling toasts within saveToFirebase
        saveToFirebase('StaticExpressions', dataToSave, toast);
    };

        saveToFirebase('StaticExpressions', dataToSave, toast);
    };
                    {isRequestLoading && <GameText />}
                    <p>Unity has loaded, and setup is complete. You can now interact with the Unity content.</p>
                    <SliderDrawer
                        auStates={auStates}
                        setAuStates={setAuStates}
                        animationManager={animationManager}
                        drawerControls={drawerControls}
                        setDrawerControls={setDrawerControls}
                    />
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
