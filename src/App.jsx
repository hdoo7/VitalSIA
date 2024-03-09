import React from 'react';
import { useUnityState } from './unityMiddleware';

function App() {
  const { isLoaded, engine, facslib } = useUnityState();

  React.useEffect(() => {
    if (isLoaded) {
      // Hide the loader when Unity is loaded
      const loaderElement = document.getElementById('loader');
      if (loaderElement) {
        loaderElement.style.display = 'none';
      }
      console.log('Unity is loaded. Engine and facslib are now available for use.');
      // Now you can use engine and facslib for further operations
    }
  }, [isLoaded, engine, facslib]);

  return (
    <div className="App">
      {isLoaded ? (
        <p>Unity has loaded. You can now interact with the Unity content.</p>
      ) : (
        <div id="loader">Loading Unity content...</div>
      )}
    </div>
  );
}

export default App;
