import React from 'react';
import { useUnityLoaded } from './unityMiddleware';

function App() {
  const isUnityLoaded = useUnityLoaded();

  React.useEffect(() => {
    if (isUnityLoaded) {
      // Hide the loader when Unity is loaded
      const loaderElement = document.getElementById('loader');
      if (loaderElement) {
        loaderElement.style.display = 'none';
      }
      console.log('Unity is loaded. Execute further actions here.');
    }
  }, [isUnityLoaded]);

  return (
    <div className="App">
      {isUnityLoaded ? (
        <p>Unity has loaded. You can now interact with the Unity content.</p>
      ) : (
        <div id="loader">Loading Unity content...</div>
      )}
    </div>
  );
}

export default App;
      ) : (
        <p>Loading Unity content...</p>
      )}
    </div>
  );
}

export default App;
