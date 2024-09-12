import ReactDOMClient from 'react-dom/client';
import React, { useState, useEffect, useRef } from 'react';
import AudioToText from './../VISOS/perception/audio/AudioToText';
import TextToListenerWithFollowUp from './../VISOS/perception/audio/TextToListenerWithFollowUp';
import TextToGptReconciler from './../VISOS/cognition/TextToGptReconciler';
import VoiceManager from './../VISOS/action/verbalizers/VoiceManager';
import TrafficLightIndicator from '../components/TrafficLightIndicator'; // Import the separate traffic light component

let audioToText;
let textToListenerWithFollowUp;
let gptReconciler;
let voiceManager;
let conversationStarted = false;
let speaking = false; // Track whether the agent is speaking
let root = null; // To hold the React DOM root for rendering the chat
const listenBufferTime = 1000; // Buffer time (in ms) after speaking before resuming listening

// Helper function to initialize modules
const initializeModules = (animationManager, appSettings) => {
  const triggerPhrases = appSettings.triggerPhrases;
  const apiKey = appSettings.apiKey;

  audioToText = new AudioToText('webspeech');
  textToListenerWithFollowUp = new TextToListenerWithFollowUp(triggerPhrases); // Simplified
  gptReconciler = new TextToGptReconciler(apiKey);
  voiceManager = VoiceManager.getInstance(animationManager);
};

// Function to handle transcribed text
const handleTranscribedText = (text, statusRef, toast) => {
  console.log(`Transcribed text: ${text}`);

  if (speaking) {
    console.log("Agent is speaking, pause listening...");
    return;
  }

  // Use TextToListenerWithFollowUp to process the transcribed text
  textToListenerWithFollowUp.listenForFollowUp(text)
    .then(result => {
      if (result) {
        handleTriggerOrFollowUp(result, statusRef, toast); // Pass toast for notifications
      } else {
        console.log("No trigger detected.");
      }
    })
    .catch(error => {
      console.error("Error processing text:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing the text.",
        status: "error",
        duration: 2000,
      });
    });
};

// Function to handle trigger phrases or follow-up text
const handleTriggerOrFollowUp = ({ phrase, followUp }, statusRef, toast) => {
  conversationStarted = true;

  if (phrase && followUp) {
    console.log(`Detected trigger phrase with follow-up: ${phrase}, ${followUp}`);
    processTextWithGPT(followUp, statusRef, toast);
  } else if (phrase) {
    console.log(`Detected trigger phrase: ${phrase}`);
    handleTriggerPhraseWithoutFollowUp(statusRef, toast);
  }
};

// Function to process text through GPT
const processTextWithGPT = (text, statusRef, toast) => {
  speaking = true;
  statusRef.current = 'talking';

  gptReconciler.processText(text, 'Answer seriously:')
    .then(response => {
      if (response) {
        voiceManager.enqueueText(response);
        toast({
          title: "Response from GPT",
          description: response,
          status: "info",
          duration: 3000,
        });
      }

      statusRef.current = 'idle';

      // Resume listening after a buffer time
      setTimeout(() => {
        speaking = false;
        statusRef.current = 'listening';
        audioToText.startContinuousRecognition((text) => handleTranscribedText(text, statusRef, toast));
      }, listenBufferTime);
    });
};

// Function to handle trigger phrase without follow-up
const handleTriggerPhraseWithoutFollowUp = (statusRef, toast) => {
  speaking = true;
  voiceManager.enqueueText("Hello! I'm here to assist. You can start by saying something or asking a question.");
  toast({
    title: "Trigger phrase detected",
    description: "Hello! I'm here to assist. You can ask me anything.",
    status: "info",
    duration: 2000,
  });
  statusRef.current = 'talking';

  // Resume listening after a buffer time
  setTimeout(() => {
    speaking = false;
    statusRef.current = 'listening';
    audioToText.startContinuousRecognition((text) => handleTranscribedText(text, statusRef, toast));
  }, listenBufferTime);
};

// Start function to initialize and render ChatApp using ReactDOM
export const start = (animationManager, appSettings, containerRef, toast) => {
  if (!containerRef || !containerRef.current) {
    console.error('Invalid container reference');
    return;
  }

  initializeModules(animationManager, appSettings);

  const ChatApp = () => {
    const [_, setRender] = useState(false); // Dummy state to trigger renders
    const statusRef = useRef('idle'); // Use a ref to track status

    // Trigger re-renders based on status changes
    useEffect(() => {
      const interval = setInterval(() => {
        setRender(render => !render); // Toggle state to force re-render
      }, 500); // Adjust as needed to refresh UI

      return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    // Notify the user of the transcribed text using toast
    useEffect(() => {
      if (statusRef.current === 'listening') {
        toast({
          title: "Listening...",
          description: "Waiting for speech input.",
          status: "info",
          duration: 2000,
        });
      }
    }, [statusRef.current]);

    return (
      <div>
        <TrafficLightIndicator status={statusRef.current} />
      </div>
    );
  };

  if (!root) {
    root = ReactDOMClient.createRoot(containerRef.current);
  }

  root.render(<ChatApp />);

  // Start continuous recognition with statusRef to control state
  audioToText.startContinuousRecognition((text) => handleTranscribedText(text, { current: 'idle' }, toast));
};

// Stop function to unmount ChatApp and stop processes
export const stop = () => {
  if (audioToText) {
    audioToText.stopRecognition();
  }
  if (voiceManager) {
    voiceManager.stopSpeech();
  }
  if (root) {
    root.unmount();
    root = null;
  }
};