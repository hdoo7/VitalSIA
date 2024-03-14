import React from 'react';
import Loader from './components/Loader'; // Assuming Loader component is correctly implemented
import SliderDrawer from './components/SliderDrawer'; // Import the SliderDrawer component
import { useUnityState } from './unityMiddleware';
import { smile, loopRandomBlink, stickTongueOut, pullTongueIn } from './VISOS/effectors/visualizers/facialExpressions';
import AnimationManager from './VISOS/effectors/visualizers/AnimationManager';
import SpeechManager from './VISOS/effectors/verbalizers/SpeechManager.js'
import faceMaker from './faceMaker.js' // Use faceMaker instead of labial

function App() {
  const { isLoaded, engine, facslib } = useUnityState();

  React.useEffect(() => {
    if (isLoaded) {
      console.log('Unity is loaded. Engine and facslib are now available for use.');
      const animationManager = new AnimationManager(facslib);
      const speechManager = SpeechManager.getInstance(animationManager);
      //peechManager.enqueueText(`Hi!! I'm Amy!! an empathetic embodied virtual agents developed by Dr. Christine Lisetti at Visage laboratory. Welcome to Vis facs 2024! To get started adjusting my facial expressions, just click the hamburger menu icon on the top left.`)
      loopRandomBlink(animationManager);
      faceMaker(engine, facslib); 
      window.animationManager = animationManager;
      const happyHighTraitsJson = JSON.stringify([
        {
            "au": "AU6",
            "intensity": 0.7,
            "duration": 5
        },
        {
            "au": "AU12",
            "intensity": 0.9,
            "duration": 5
        },
        {
            "au": "AU1",
            "intensity": 0.5,
            "duration": 5
        },
        {
            "au": "AU25",
            "intensity": 0.4,
            "duration": 5
        },
        {
            "au": "AU5",
            "intensity": 0.3,
            "duration": 5
        }
    ]);
    
    // Applying AU changes from JSON to the AnimationManager
    animationManager.applyChangesFromJson(happyHighTraitsJson);

  // Applying AU changes from JSON to the AnimationManager
    }
    
  }, [isLoaded, engine, facslib]);

  return (
    <div className="App">
      <Loader isLoading={!isLoaded} />
      {isLoaded && (
        <>
          <p>Unity has loaded. You can now interact with the Unity content.</p>
          <SliderDrawer animationManager={new AnimationManager(facslib)} />
        </>
      )}
    </div>
  );
}

export default App;

