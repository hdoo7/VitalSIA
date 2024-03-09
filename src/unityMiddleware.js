import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for Unity load state
const UnityLoadContext = createContext();

export const UnityLoadProvider = ({ children }) => {
  const [isUnityLoaded, setUnityLoaded] = useState(false);

  useEffect(() => {
    // Listen for the custom event dispatched from Unity when the scene is loaded
    const handleUnityEvent = () => {
      setUnityLoaded(true);
    };
    window.addEventListener('unityLoaded', handleUnityEvent);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('unityLoaded', handleUnityEvent);
    };
  }, []);

  return (
    <UnityLoadContext.Provider value={isUnityLoaded}>
      {children}
    </UnityLoadContext.Provider>
  );
};

// Custom hook to use Unity load state
export const useUnityLoaded = () => useContext(UnityLoadContext);
