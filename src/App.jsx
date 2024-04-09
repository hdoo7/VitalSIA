import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import SliderDrawer from './components/SliderDrawer';
import { useUnityState } from './unityMiddleware';
import AnimationManager from './VISOS/effectors/visualizers/AnimationManager';
import { loopRandomBlink, smile } from './VISOS/effectors/visualizers/facialExpressions';
import faceMaker from './faceMaker';
import { ActionUnitsList } from './unity/facs/shapeDict';
import { useToast } from '@chakra-ui/react'; // Assuming Chakra UI for toast notifications
import GameText from './components/GameText';


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
    const [isRequestLoading, setIsRequestLoading] = useState(false); // New loading state for requests
    const toast = useToast();

    useEffect(() => {
        if (isLoaded && facslib && !animationManager) {
            const manager = new AnimationManager(facslib, setAuStates);
            setAnimationManager(manager);
            loopRandomBlink(manager);
            faceMaker(manager, setIsRequestLoading, toast); // Pass the new loading state and toast method to faceMaker
            setSetupComplete(true);
        }
    }, [isLoaded, facslib]);

    // New method to trigger toast messages
    

    return (
        <div className="App">
            <Loader isLoading={!isLoaded || !setupComplete} />
            {isLoaded && setupComplete && animationManager && (
                <>
                    <p>Unity has loaded, and setup is complete. You can now interact with the Unity content.</p>
                    {isRequestLoading && <GameText />}
                    <SliderDrawer
                        auStates={auStates}
                        setAuStates={setAuStates}
                        animationManager={animationManager}
                        drawerControls={drawerControls}
                        setDrawerControls={setDrawerControls}
                    />

                </>
            )}
        </div>
    );
}

export default App;
