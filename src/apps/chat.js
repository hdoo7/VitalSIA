import SpeechProcessor from '../VISOS/sensors/audio/SpeechProcessor';
import VoiceManager from '../VISOS/effectors/verbalizers/VoiceManager';

let speechProcessor;
let voiceManager;

function start(animationManager, settings) {
  const { apiKey, triggerPhrases } = settings;

  voiceManager = new VoiceManager(animationManager);

  speechProcessor = new SpeechProcessor(triggerPhrases, async (text) => {
    console.log(`Detected text: ${text}`);
    
    // Implement the logic to send the text to GPT and get the response
    const response = await fetchChatResponse(apiKey, text);

    // Use voiceManager to speak the response
    voiceManager.enqueueText(response);
  });

  // Start the speech recognition process
  console.log("Starting speech recognition...");
  speechProcessor.start();
}

function stop() {
  if (speechProcessor) {
    speechProcessor.stop();
  }
  if (voiceManager) {
    voiceManager.stopSpeech();
  }
}

async function fetchChatResponse(apiKey, text) {
  // Implement the logic to fetch the response from GPT using the API key
  // This is a placeholder function
  return `Response to: ${text}`;
}

export { start, stop };