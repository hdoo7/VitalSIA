// File: BaseStreamManager.js
import 'webrtc-adapter';

export default class BaseStreamManager {
    constructor() {
        console.log("BaseStreamManager constructor called");
        this.stream = null;
        this.initUI();
    }

    initUI() {
        console.log("Initializing UI for BaseStreamManager");
        this.recordingIndicator = document.createElement('div');
        this.recordingIndicator.innerText = '🔴 Recording...';
        this.recordingIndicator.style.position = 'fixed';
        this.recordingIndicator.style.bottom = '20px';
        this.recordingIndicator.style.left = '20px';
        this.recordingIndicator.style.backgroundColor = '#ff0000';
        this.recordingIndicator.style.color = '#ffffff';
        this.recordingIndicator.style.padding = '10px';
        this.recordingIndicator.style.borderRadius = '5px';
        this.recordingIndicator.style.display = 'none'; // Hidden by default

        if (document.readyState === 'complete') {
            document.body.appendChild(this.recordingIndicator);
        } else {
            window.addEventListener('load', () => {
                document.body.appendChild(this.recordingIndicator);
            });
        }
    }

    toggleRecordingIndicator(show) {
        if (this.recordingIndicator) {
            this.recordingIndicator.style.display = show ? 'block' : 'none';
        }
    }

    async getAudioStream() {
        console.log("Attempting to get audio stream");
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("MediaDevices API or getUserMedia not supported.");
            return null;
        }

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("Audio stream acquired.");
            this.toggleRecordingIndicator(true); // Show recording indicator
            return this.stream;
        } catch (err) {
            console.error("Error accessing the microphone:", err);
            this.toggleRecordingIndicator(false);
            return null;
        }
    }

    stopStream() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            console.log("Stream stopped.");
            this.toggleRecordingIndicator(false); // Hide recording indicator
        }
    }
}