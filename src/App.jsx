import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import SliderDrawer from './components/SliderDrawer';
import { useUnityState } from './unityMiddleware';
import AnimationManager from './VISOS/effectors/visualizers/AnimationManager';
import { loopRandomBlink } from './VISOS/effectors/visualizers/facialExpressions';
import faceMaker from './faceMaker';
import { ActionUnitsList } from './unity/facs/shapeDict'; // Adjust the import path as necessary

function App() {
  const { isLoaded, engine, facslib } = useUnityState();

  // Initialize AU states dynamically based on ActionUnitsList
  const initialAuStates = ActionUnitsList.reduce((acc, au) => ({
    ...acc,
    [au.id]: { intensity: 0, notes: "" }, // Default values for each AU
  }), {});

  const [auStates, setAuStates] = useState(initialAuStates);
  const [setupComplete, setSetupComplete] = useState(false); // New state to track setup completion
  let animationManager;
  useEffect(() => {
    if (isLoaded) {
      console.log('Unity is loaded. Engine and facslib are now available for use.');
      animationManager = new AnimationManager(facslib, setAuStates);
      loopRandomBlink(animationManager);
      faceMaker(animationManager);
      
      // const happyHighTraitsJson = JSON.stringify([
      //   // Your AU configurations here
      // ]);
      
      // animationManager.applyChangesFromJson(happyHighTraitsJson);

      // Once all setup is done, set setupComplete to true
      setSetupComplete(true);
    }
  }, [isLoaded, engine, facslib, setAuStates]); // Add setupComplete to dependency array if needed

  return (
    <div className="App">
      {/* Show loader until setupComplete is true */}
      <Loader isLoading={!isLoaded || !setupComplete} />
      {isLoaded && setupComplete && (
        <>
          <p>Unity has loaded, and setup is complete. You can now interact with the Unity content.</p>
          <SliderDrawer auStates={auStates} setAuStates={setAuStates} animationManager={animationManager} />
        </>
      )}
    </div>
  );
}

export default App;
