import React, { createContext, useContext, useState, useEffect } from 'react';

const UnityLoadContext = createContext();

export const UnityLoadProvider = ({ children }) => {
  const [unityState, setUnityState] = useState({ isLoaded: false, engine: null, facslib: null });

  useEffect(() => {
    const handleUnityLoad = (event) => {
      setUnityState({
        isLoaded: true,
        engine: event.detail.engine,
        facslib: event.detail.facslib
      });
    };
    document.addEventListener('unityLoaded', handleUnityLoad);
    return () => document.removeEventListener('unityLoaded', handleUnityLoad);
  }, []);

  return (
    <UnityLoadContext.Provider value={unityState}>
      {children}
    </UnityLoadContext.Provider>
  );
};

export const useUnityState = () => useContext(UnityLoadContext);
