class WebcamManager {
    constructor() {
      this.stream = null;
      console.log('WebcamManager initialized'); // Debugging log
    }
  
    async initialize() {
      console.log('Initializing webcam...'); // Debugging log
      try {
        // Request webcam access with audio if needed
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        console.log('Webcam stream acquired:', this.stream); // Debugging log
        return true;
      } catch (error) {
        console.error('Error accessing webcam:', error);
        return false;
      }
    }
  
    attachStream(videoElement) {
      if (this.stream && videoElement) {
        console.log('Attaching stream to video element'); // Debugging log
        videoElement.srcObject = this.stream;
      } else {
        console.error('Stream or videoElement not available to attach'); // Debugging log
      }
    }
  
    stop() {
      if (this.stream) {
        console.log('Stopping webcam stream'); // Debugging log
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }
    }
  }
  
  export default WebcamManager;