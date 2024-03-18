import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import SliderDrawer from './components/SliderDrawer';
import { useUnityState } from './unityMiddleware';
import AnimationManager from './VISOS/effectors/visualizers/AnimationManager';
import { loopRandomBlink, smile } from './VISOS/effectors/visualizers/facialExpressions';
import faceMaker from './faceMaker';
import { ActionUnitsList } from './unity/facs/shapeDict';
import SpeechManager from './VISOS/effectors/verbalizers/SpeechManager';
import useCamera from './useCamera';

function App() {
    const { isLoaded, engine, facslib } = useUnityState();

    // Initialize AU states dynamically based on ActionUnitsList
    const initialAuStates = ActionUnitsList.reduce((acc, au) => ({
        ...acc,
        [au.id]: { intensity: 0, name: au.name, notes: "" },
    }), {});

    const [auStates, setAuStates] = useState(initialAuStates);
    const [animationManager, setAnimationManager] = useState(null);
    const [setupComplete, setSetupComplete] = useState(false);
    const [drawerControls, setDrawerControls] = useState({
        isOpen: false,
        showUnusedSliders: false,
        cameraEnabled: false,
    });

    useEffect(() => {
        if (isLoaded && facslib && !animationManager) {
            console.log('Unity is loaded. Engine and facslib are now available for use.');
            const manager = new AnimationManager(facslib, setAuStates);
            setAnimationManager(manager);
            loopRandomBlink(manager);
            faceMaker(manager);
            const speechManager = new SpeechManager(manager);
            speechManager.enqueueText("Welcome to Vis Facs 2024! To get started say 'Hey Amy show me...' and then name a facial expression. For example, you might say, 'Hey Amy, show me a look of agreeable disbelief!'");
            const sampleJsonString = JSON.stringify([
              { "id": "1", "intensity": 0.5, "duration": 500, "delay": 0 },
              { "id": "2", "intensity": 0.7, "duration": 500, "delay": 100 },
              { "id": "12", "intensity": 1.0, "duration": 1000, "delay": 200 }
            ]);
            
            // Wait for manager to be set up before applying changes from JSON.
            manager.applyChangesFromJson(sampleJsonString);
            setSetupComplete(true);
        }
    }, [isLoaded, facslib]);

    const handleDrawerControlsChange = (updates) => {
        setDrawerControls(prev => ({ ...prev, ...updates }));

        // If enabling camera controls for the first time
        if (updates.cameraEnabled && !drawerControls.cameraEnabled) {
            useCamera(); // This function would enable camera controls
        }
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
                        setDrawerControls={handleDrawerControlsChange}
                    />
                </>
            )}
        </div>
    );
}

export default App;
