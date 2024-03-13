import React from 'react';
import Loader from './components/Loader'; // Assuming Loader component is correctly implemented
import SliderDrawer from './components/SliderDrawer'; // Import the SliderDrawer component
import { useUnityState } from './unityMiddleware';
import { smile, loopRandomBlink, stickTongueOut, pullTongueIn } from './VISOS/effectors/visualizers/facialExpressions';
import AnimationManager from './VISOS/effectors/visualizers/AnimationManager';
import SpeachManager from './VISOS/effectors/verbalizers/SpeachManager.js'

function App() {
  const { isLoaded, engine, facslib } = useUnityState();

  React.useEffect(() => {
    if (isLoaded) {
      console.log('Unity is loaded. Engine and facslib are now available for use.');
      const animationManager = new AnimationManager(facslib);
      const speachManager = new SpeachManager(animationManager);
      speachManager.enqueueText(`Welcome to Vis facs 2024! To get started adjusting my facial expressions, just click the hamburger menu icon on the top left.`)
      loopRandomBlink(animationManager);

    }
  }, [isLoaded, engine, facslib]);

  return (
    <div className="App">
      <Loader isLoading={!isLoaded} />
      {isLoaded && (
        <>
          <p>Unity has loaded. You can now interact with the Unity content.</p>
          {/* Include the SliderDrawer component here */}
          <SliderDrawer animationManager={new AnimationManager(facslib)} />
        </>
      )}
    </div>
  );
}

export default App;
