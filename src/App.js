import React from 'react';
import { useUnityLoaded } from './unityMiddleware';

function App() {
  const isUnityLoaded = useUnityLoaded();

  // Placeholder for additional logic to be executed after Unity is loaded
  const unityLoadedAction = () => {
    console.log('Unity is loaded. Execute further actions here.');
    // You can include the logic that was previously in the old app.js here
  };

  React.useEffect(() => {
    if (isUnityLoaded) {
      unityLoadedAction();
    }
  }, [isUnityLoaded]);

  return (
    <div className="App">
      {isUnityLoaded ? (
        <p>Unity has loaded. You can now interact with the Unity content.</p>
      ) : (
        <p>Loading Unity content...</p>
      )}
    </div>
  );
}

export default App;