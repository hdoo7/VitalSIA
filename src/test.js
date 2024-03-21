import SpeechProcessor from './VISOS/sensors/audio/SpeechProcessor.js';
const test = ()=>{
const triggerPhrase = 'Hey GPT'; // Define your trigger phrase
const onTriggerDetected = (text) => {
  console.log(`Trigger detected, sending text to GPT: ${text}`);
  // Here, you would send the text to your server for GPT processing.
  // For example, using fetch to send a POST request to your API endpoint.
};

const speechProcessor = new SpeechProcessor(triggerPhrase, onTriggerDetected);
speechProcessor.start(); // Start processing
}
export default test;