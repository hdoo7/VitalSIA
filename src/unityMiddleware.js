import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for Unity load state
const UnityLoadContext = createContext();

export const UnityLoadProvider = ({ children }) => {
  const [isUnityLoaded, setUnityLoaded] = useState(false);

  // Function to call from Unity's load event handlers
  const handleUnityLoaded = () => {
    setUnityLoaded(true);
  };

  // Make the handler globally accessible for Unity scripts
  window.handleUnityLoaded = handleUnityLoaded;

  return (
    <UnityLoadContext.Provider value={isUnityLoaded}>
      {children}
    </UnityLoadContext.Provider>
  );
};

// Custom hook to use Unity load state
export const useUnityLoaded = () => useContext(UnityLoadContext);