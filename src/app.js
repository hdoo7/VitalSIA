import React from 'react';
import { useUnityLoaded } from './unityMiddleware.js';

function App() {
  const isUnityLoaded = useUnityLoaded();

 

  return (
    <div className="App">
      
        <p>Unity has loaded. You can now interact with the Unity content.</p>
    </div>
  );
}
export default App;
