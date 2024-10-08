import * as faceapi from 'face-api.js';

export default class VideoToEmotion {
    constructor() {
        this.videoElement = null;
        this.isProcessing = false;
        this.intervalId = null;
    }

    // Initialize the video element for processing
    initVideo(videoElement) {
        this.videoElement = videoElement;
    }

    // Load face-api.js models before detection
    async loadModels() {
        const MODEL_URL = process.env.PUBLIC_URL + '/models';
        try {
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
            console.log('Models loaded successfully');
        } catch (error) {
            console.error('Error loading models:', error);
            throw new Error('Failed to load face-api models');
        }
    }

    // Start the webcam stream and setup face detection
    async startVideoStream() {
        try {
            if (!this.videoElement) throw new Error("Video element not initialized.");

            // Ensure models are loaded before starting the video stream
            await this.loadModels();

            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.videoElement.srcObject = stream;  // Attach webcam stream to video element
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
    }

    // Start detecting emotions from the video feed
    startContinuousDetection(onEmotionDetectedCallback) {
        if (this.isProcessing) {
            console.warn("Emotion detection is already running.");
            return;
        }

        this.isProcessing = true;

        const detectEmotions = async () => {
            if (!this.videoElement) return;

            const detections = await faceapi
                .detectAllFaces(this.videoElement, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();

            if (detections.length > 0) {
                const emotions = detections[0].expressions;
                onEmotionDetectedCallback(emotions);
            }
        };

        this.intervalId = setInterval(detectEmotions, 100); // Detect emotions every 100ms
    }

    // Stop emotion detection
    stopDetection() {
        if (this.isProcessing) {
            clearInterval(this.intervalId);
            this.isProcessing = false;
        }
    }

    // Stop the video stream when unmounting
    stopVideoStream() {
        if (this.videoElement && this.videoElement.srcObject) {
            const stream = this.videoElement.srcObject;
            stream.getTracks().forEach(track => track.stop());
            this.videoElement.srcObject = null;
        }
    }
}