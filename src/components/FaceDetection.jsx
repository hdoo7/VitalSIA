import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

const FaceDetection = ({ canvasId }) => {
  const overlayRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Function to load face-api models
  const loadModels = async () => {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    setIsModelLoaded(true);
    console.log('Face API models loaded');
  };

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    if (!isModelLoaded) return;

    let captureCanvas = document.createElement('canvas');
    captureCanvas.id = 'capture-canvas';
    captureCanvas.style.display = 'none'; // Hide this canvas
    document.body.appendChild(captureCanvas);

    const interval = setInterval(async () => {
      const unityCanvas = document.getElementById(canvasId);
      const overlayCanvas = overlayRef.current;
      if (!unityCanvas || !overlayCanvas) {
        console.error("Canvas elements are not ready");
        return;
      }

      // Ensure the captureCanvas matches the dimensions of the Unity canvas
      captureCanvas.width = unityCanvas.offsetWidth;
      captureCanvas.height = unityCanvas.offsetHeight;

      // Draw the content of the Unity WebGL canvas onto the captureCanvas
      const captureContext = captureCanvas.getContext('2d');
      captureContext.drawImage(unityCanvas, 0, 0, captureCanvas.width, captureCanvas.height);

      // Perform face-api detection on the captureCanvas
      const detections = await faceapi.detectAllFaces(captureCanvas, new faceapi.SsdMobilenetv1Options())
                                        .withFaceLandmarks()
                                        .withFaceExpressions();
      
      // Resize and clear overlay canvas
      overlayCanvas.width = unityCanvas.offsetWidth;
      overlayCanvas.height = unityCanvas.offsetHeight;
      const context = overlayCanvas.getContext('2d');
      const displaySize = { width: overlayCanvas.width, height: overlayCanvas.height };
      faceapi.matchDimensions(overlayCanvas, displaySize);
      context.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

      // Draw detections on the overlay canvas
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      faceapi.draw.drawDetections(overlayCanvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(overlayCanvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(overlayCanvas, resizedDetections);

    }, 100);

    return () => {
      clearInterval(interval);
      document.body.removeChild(captureCanvas); // Clean up
    };
  }, [canvasId, isModelLoaded]);

  return <canvas ref={overlayRef} style={{ position: 'absolute', zIndex: 99, pointerEvents: 'none' }} />;
};

export default FaceDetection;
