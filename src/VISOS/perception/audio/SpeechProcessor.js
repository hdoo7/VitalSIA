class SpeechProcessor {
    constructor(triggerPhrases, onTriggerDetected) {
      this.triggerPhrases = this.prepareTriggerPhrasesRegex(triggerPhrases);
      this.onTriggerDetected = onTriggerDetected;
      this.recognition = null;
      this.isRecognizing = false; // Track recognition state
      this.initializeRecognition();
    }
  
    initializeRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error("Speech recognition is not supported in this browser.");
        return;
      }
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = true;
      this.recognition.continuous = true; // Aim for continuous operation
      this.recognition.onresult = (event) => this.handleResult(event);
      this.recognition.onend = () => this.handleEnd();
      this.recognition.onerror = (event) => this.handleError(event);
    }
  
    prepareTriggerPhrasesRegex(phrases) {
      const pattern = Array.isArray(phrases) ? phrases.join('|') : phrases;
      return new RegExp(pattern.split(' ').join('\\s+'), 'i');
    }
  
    start() {
      if (this.isRecognizing || !this.recognition) {
        return;
      }
      try {
        this.recognition.start();
        this.isRecognizing = true;
        console.log('Speech recognition started.');
      } catch (e) {
        console.log('Error starting speech recognition:', e);
      }
    }
  
    handleResult(event) {
      const lastResult = event.results[event.resultIndex];
      const text = lastResult[0].transcript;
      console.log(`Heard: ${text}`);
      if (lastResult.isFinal && this.triggerPhrases.test(text)) {
        console.log(`Trigger phrase matched: ${text}`);
        this.onTriggerDetected(text);
      }
    }
  
    handleEnd() {
      this.isRecognizing = false;
      console.log('Speech recognition ended, attempting to restart...');
      this.restartRecognition();
    }
  
    handleError(event) {
      this.isRecognizing = false;
      console.log('Speech recognition error, restarting.');
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        this.restartRecognition();
      }
    }
  
    restartRecognition() {
      // Implement a delay before restarting to avoid potential infinite loops or browser throttling
      setTimeout(() => {
        if (!this.isRecognizing) { // Check if it's not already restarted
          this.start();
        }
      }, 1000); // Adjust the delay as needed
    }
  }
  
  export default SpeechProcessor;
  