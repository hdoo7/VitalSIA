import ReactDOMClient from 'react-dom/client';
import React from 'react';
import EmotionDetection from '../components/EmotionDetection';

let root = null;

export const start = (animationManager, settings, containerRef) => {
  if (!containerRef || !containerRef.current) {
    console.error('Container reference not provided or invalid. Unable to start FaceDetectionApp.');
    return; // Exit the function gracefully
  }

  if (!root) {
    root = ReactDOMClient.createRoot(containerRef.current);
  }

  root.render(<EmotionDetection animationManager={animationManager} settings={settings} />);
};

export const stop = () => {
  if (root) {
    root.unmount(); // Unmount the component using the root
    root = null; // Reset root to null
  }
};