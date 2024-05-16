import React, { createContext, useState, useContext, useEffect } from 'react';

const ThreeJSContext = createContext();

export const ThreeJSProvider = ({ children }) => {
  const [isThreeJSLoaded, setIsThreeJSLoaded] = useState(false);

  useEffect(() => {
    const handleThreeJSLoaded = () => {
      setIsThreeJSLoaded(true);
    };

    document.addEventListener('threeJSLoaded', handleThreeJSLoaded);

    return () => {
      document.removeEventListener('threeJSLoaded', handleThreeJSLoaded);
    };
  }, []);

  return (
    <ThreeJSContext.Provider value={{ isThreeJSLoaded }}>
      {children}
    </ThreeJSContext.Provider>
  );
};

export const useThreeJS = () => useContext(ThreeJSContext);
