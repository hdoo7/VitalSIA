import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import SliderDrawer from './SliderDrawer';
import { useUnityState } from '../unityMiddleware';
import AnimationManager from '../VISOS/effectors/visualizers/AnimationManager';
import { loopRandomBlink, smile } from '../VISOS/effectors/visualizers/facialExpressions';
import faceMaker from '../faceMaker';
import { ActionUnitsList, VisemesList } from '../unity/facs/shapeDict';
import { useToast } from '@chakra-ui/react';
import GameText from './GameText';
import FaceDetection from './FaceDetection';
import Survey from './Survey';
import { questions } from './utils/freeFormSurveyQuestions';
import { saveToFirebase } from './utils/firebaseUtils';
import SpeechManager from '../VISOS/effectors/verbalizers/VoiceManager';
import CameraControl from '../VISOS/effectors/visualizers/CameraControl';
import CameraInputControl from '../VISOS/effectors/visualizers/CameraInputControl';
import VoiceManager from '../VISOS/effectors/verbalizers/VoiceManager';

function App() {
    const { isLoaded, engine, facslib } = useUnityState();
    const [auStates, setAuStates] = useState(ActionUnitsList.reduce((acc, au) => ({
        ...acc, [au.id]: { intensity: 0, name: au.name, notes: "" },
    }), {}));
    const [visemeStates, setVisemeStates] = useState(VisemesList.reduce((acc, viseme) => ({
        ...acc, [viseme.id]: { intensity: 0, name: viseme.name },
    }), {}));
    const [animationManager, setAnimationManager] = useState(null);
    const [setupComplete, setSetupComplete] = useState(false);
    const [drawerControls, setDrawerControls] = useState({
        isOpen: false, showUnusedSliders: false, cameraEnabled: false,
    });
    const [isSurveyActive, setIsSurveyActive] = useState(false);
    const [isRequestLoading, setRequestIsLoading] = useState(false);
    const toast = useToast();
    const vm = new VoiceManager();
    useEffect(() => {
        if (isLoaded && facslib && !animationManager) {
            const manager = new AnimationManager(facslib, setAuStates, setVisemeStates);
            const speak = new SpeechManager(manager);
            setAnimationManager(manager);
            loopRandomBlink(manager);
            faceMaker(manager, setIsSurveyActive, toast, setRequestIsLoading, speak);
            setSetupComplete(true);
            toast({ title: `To begin, just say "Hey Amy show me" and then describe what you would like to see the agent "act out".`, status: "success" });
        }
    }, [isLoaded, facslib]);

    const handleSurveyComplete = async (responses) => {
        console.log("Survey responses:", responses);
        setIsSurveyActive(false);
        const dataToSave = {
            responses,
            actionUnits: auStates,
            overallFeedback: "Overall feedback from the session",
            notes: "Detailed notes on session or AUs"
        };
        saveToFirebase('FreeForm', dataToSave, toast);
        animationManager.setFaceToNeutral(750);
    };

    return (
        <div className="App">
            {isLoaded && setupComplete && animationManager && (
                <>
                    <p>Unity has loaded, and setup is complete. You can now interact with the Unity content.</p>
                    <SliderDrawer
                        auStates={auStates}
                        visemeStates={visemeStates}
                        setAuStates={setAuStates}
                        setVisemeStates={setVisemeStates}
                        animationManager={animationManager}
                        drawerControls={drawerControls}
                        setDrawerControls={setDrawerControls}
                    />
                    {isRequestLoading && (<GameText />) }
                </>
            )}
        </div>
    );
}

export default App;

                        />
                    )}
                    <Box p={4}>
                        <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter text to synthesize"
                            mb={2}
                        />
                        <Button colorScheme="teal" onClick={handleEnqueueText} mb={2}>
                            Enqueue Text
                        </Button>
                        <Button colorScheme="red" onClick={handleStopSpeech} mb={2}>
                            Stop Speech
                        </Button>
                        <Button colorScheme="yellow" onClick={handleInterruptSpeech}>
                            Interrupt Speech
                        </Button>
                    </Box>
                </>
            )}
        </div>
    );
}

export default App;

