import React, { useEffect } from 'react';
import { useUnityState } from './unityMiddleware';

const Blinker = ({ doubleBlink = false, speed = 3000 }) => {
  const { isLoaded, facslib } = useUnityState();

  useEffect(() => {
    if (!isLoaded || !facslib) return;

    const triggerBlink = () => {
      facslib.triggerBlink(); // Placeholder for actual Unity blink trigger

      if (doubleBlink) {
        // Double blink with random delay based on speed
        setTimeout(() => {
          facslib.triggerBlink(); // Second blink
        }, speed / 2 + Math.random() * speed / 2);
      }
    };

    const intervalId = setInterval(triggerBlink, speed + Math.random() * speed);

    return () => clearInterval(intervalId);
  }, [doubleBlink, speed, isLoaded, facslib]);

  return null; // Renders nothing, purely functional
};

export default Blinker;