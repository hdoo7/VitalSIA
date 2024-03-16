// Assuming useUnityState is exported from your unityMiddleware module
import { useUnityState } from './unityMiddleware';
import React, { useEffect } from 'react';
import AudioToText from './VISOS/sensors/audio/AudioToText';
import TextToListenerWithFollowUp from './VISOS/sensors/audio/TextToListenerWithFollowUp';
import TextToGptReconciler from './VISOS/reconcilers/TextToGptReconciler';
import faces from './prompts/faces';
import { headUp, headDown } from './VISOS/effectors/visualizers/facialExpressions';

const useFaceMaker = () => {
  const { animationManager } = useUnityState(); // Directly use the custom hook

  useEffect(() => {
    if (!animationManager) {
      console.log("Animation Manager not available.");
      return; // Ensure animationManager is available before proceeding
    }

    const audioToText = new AudioToText();
    const textToListener = new TextToListenerWithFollowUp(['amy show me', 'set face to neutral']);
    const gptReconciler = new TextToGptReconciler();
    console.log("Starting audio transcription...");

    const loop = () => {
      audioToText.startContinuousRecognition()
        .then(text => {
          console.log(`Transcribed text: ${text}`);
          return textToListener.listen(text);
        })
        .then(detectedPhrase => {
          setTimeout(() => loop(), 3000);
          console.log(detectedPhrase);
          headDown(animationManager);

          if (!detectedPhrase.debounceText && detectedPhrase.detectedPhrase === 'set face to neutral') {
            console.log("Setting face to neutral.");
            animationManager.setFaceToNeutral();
            return;
          }
          if (!detectedPhrase || !detectedPhrase.debounceText) {
            return;
          }

          return gptReconciler.processText(detectedPhrase.debounceText, faces);
        })
        .then(gptResponse => {
          if (gptResponse) {
            console.log(`GPT Response: ${gptResponse}`);
            const parsed = JSON.parse(gptResponse);
            animationManager.applyChangesFromJson(JSON.stringify(parsed.aus));
          }
        })
        .catch(error => console.error("Error in processing:", error))
        .finally(() => headUp(animationManager));
    };

    // Start the loop with a slight delay to ensure everything is set up properly
    setTimeout(() => loop(), 30);

    // Cleanup function to potentially stop continuous recognition when component unmounts
    return () => audioToText.stopContinuousRecognition();
  }, [animationManager]); // Dependency array ensures this effect runs when animationManager changes

  // No need to return anything unless you want to provide control or status outwards
};

export default useFaceMaker;
