import React, { useEffect, useRef, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import * as faceapi from 'face-api.js';
import WebcamManager from '../VISOS/sensors/video/WebcamManager';

const FaceDetection = ({ onFaceDetection }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false); // Track model loading status
  const webcamManager = useRef(new WebcamManager());

  useEffect(() => {
    // Load face-api.js models
    const loadModels = async () => {
      try {
        console.log('Loading models...');
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        console.log('Models successfully loaded.');
        setModelsLoaded(true); // Set modelsLoaded to true after loading models
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    loadModels();

    return () => {
      webcamManager.current.stop();
    };
  }, []);

  const handleStart = async () => {
    console.log('Attempting to start webcam...');
    try {
      const permissionGranted = await webcamManager.current.initialize();
      if (permissionGranted && modelsLoaded) {
        console.log('Webcam permission granted and stream attached.');
        setIsWebcamEnabled(true);
      } else if (!permissionGranted) {
        console.error('Webcam access denied or failed.');
      } else if (!modelsLoaded) {
        console.error('Models not yet loaded.');
      }
    } catch (error) {
      console.error('Error initializing webcam:', error);
    }
  };

  // Use useEffect to attach stream once videoRef is available
  useEffect(() => {
    if (isWebcamEnabled && videoRef.current) {
      console.log('Attaching webcam stream to video element...');
      webcamManager.current.attachStream(videoRef.current);
      videoRef.current.onloadeddata = () => {
        if (modelsLoaded) {
          console.log('Starting face detection...');
          startFaceDetection();
        } else {
          console.error('Models still not loaded when trying to start face detection.');
        }
      };
    }
  }, [isWebcamEnabled, modelsLoaded]);

  const startFaceDetection = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const detectFace = async () => {
      // Set canvas dimensions to match the video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      setInterval(async () => {
        if (modelsLoaded) {
          const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
          const resizedDetections = faceapi.resizeResults(detections, { width: video.videoWidth, height: video.videoHeight });

          // Clear previous drawings
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

          // Draw bounding boxes and landmarks on the canvas
          faceapi.draw.drawDetections(canvas, resizedDetections); // Draw bounding boxes
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections); // Draw facial landmarks

          // Callback to parent component or app if needed
          if (onFaceDetection) {
            onFaceDetection(resizedDetections);
          }
        }
      }, 100);
    };

    detectFace();
  };

  return (
    <Box>
      {!isWebcamEnabled && (
        <Button colorScheme="teal" onClick={handleStart} style={{ fontFamily: 'Avenir' }}>
          Enable Webcam
        </Button>
      )}

      {isWebcamEnabled && (
        <Box position="relative">
          <video ref={videoRef} autoPlay muted style={{ width: '100%', height: 'auto' }} />
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
        </Box>
      )}
    </Box>
  );
};

export default FaceDetection;