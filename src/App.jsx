import React from 'react';
import Loader from './components/Loader'; // Assuming Loader component is correctly implemented
import SliderDrawer from './components/SliderDrawer'; // Import the SliderDrawer component
import { useUnityState } from './unityMiddleware';
import { smile, loopRandomBlink, stickTongueOut, pullTongueIn } from './VISOS/effectors/visualizers/facialExpressions';
import AnimationManager from './VISOS/effectors/visualizers/AnimationManager';

function App() {
  const { isLoaded, engine, facslib } = useUnityState();

  React.useEffect(() => {
    if (isLoaded) {
      console.log('Unity is loaded. Engine and facslib are now available for use.');
      const animationManager = new AnimationManager(facslib);
      smile(animationManager);
      loopRandomBlink(animationManager);
      pullTongueIn(animationManager);
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
