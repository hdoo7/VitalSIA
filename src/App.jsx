import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import SliderDrawer from './components/SliderDrawer';
import { useUnityState } from './unityMiddleware';
import AnimationManager from './VISOS/effectors/visualizers/AnimationManager';
import { loopRandomBlink, smile } from './VISOS/effectors/visualizers/facialExpressions';
import faceMaker from './faceMaker';
import { ActionUnitsList } from './unity/facs/shapeDict';

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

  useEffect(() => {
    if (isLoaded && facslib && !animationManager) {
      console.log('Unity is loaded. Engine and facslib are now available for use.');
      const manager = new AnimationManager(facslib, setAuStates);
      setAnimationManager(manager);
      loopRandomBlink(manager);

      faceMaker(manager);
      // smile(manager)
      // Example to test or initialize AU changes. Adjust as necessary.
      const sampleJsonString = JSON.stringify([
        { "au": "AU1", "intensity": 0.5, "duration": 500, "delay": 0 },
        { "au": "AU2", "intensity": 0.7, "duration": 500, "delay": 100 },
        { "au": "AU12", "intensity": 1.0, "duration": 1000, "delay": 200 }
      ]);
      
      // Wait for manager to be set up before applying changes from JSON.
      manager.applyChangesFromJson(sampleJsonString);

      setSetupComplete(true);
    }
  }, [isLoaded, facslib]); // Ensure useEffect depends on the necessary variables

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
          />
        </>
      )}
    </div>
  );
}

export default App;
