import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import SliderDrawer from './SliderDrawer';
import { useUnityState } from '../unityMiddleware';
import AnimationManager from '../VISOS/action/visualizers/AnimationManager';
import { loopRandomBlink, smile } from '../VISOS/action/visualizers/facialExpressions';
// import faceMaker from '../faceMaker';
import { ActionUnitsList, VisemesList } from '../unity/facs/shapeDict';
import { useToast, Box, Button, Textarea } from '@chakra-ui/react';
import GameText from './GameText';
import ModulesMenu from './ModulesMenu';

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
    const [isRequestLoading, setRequestIsLoading] = useState(false);
    const toast = useToast();
    const [text, setText] = useState('');

    useEffect(() => {
        if (isLoaded && facslib && !animationManager) {
            const manager = new AnimationManager(facslib, setAuStates, setVisemeStates);
            window.animationManager = manager;
           
            setAnimationManager(manager);
            // faceMaker(manager, setIsSurveyActive, toast, setRequestIsLoading, speak);
            setSetupComplete(true);
        }
    }, [isLoaded, facslib]);

    return (
        <div className="App">
            {isLoaded && setupComplete && animationManager && (
                <>
                    <p>Unity has loaded, and setup is complete. You can now interact with the Unity content.</p>
                    <SliderDrawer
                        auStates={auStates}
                        setAuStates={setAuStates}
                        visemeStates={visemeStates}
                        setVisemeStates={setVisemeStates}
                        animationManager={animationManager}
                        drawerControls={drawerControls}
                        setDrawerControls={setDrawerControls}
                    />
                    <ModulesMenu animationManager={animationManager} />

                    {isRequestLoading && (<GameText />)}
                    
                    
                </>
            )}
        </div>
    );
}

export default App;

