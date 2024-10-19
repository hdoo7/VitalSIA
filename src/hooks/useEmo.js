import { useState, useCallback, useRef } from 'react';
import VideoToEmotion from '../VISOS/perception/video/VideoToEmotion';  // Import Video Sensor

const useEmo = () => {
    const [emotionState, setEmotionState] = useState({
        detectedEmotion: null,
        emotionIntensities: {
            joy: 0,
            anger: 0,
            disgust: 0,
            fear: 0,
            sadness: 0,
            surprise: 0
        },
        status: 'idle',  // Possible statuses: 'idle', 'detecting', 'stopped'
    });

    const videoToEmotion = useRef(new VideoToEmotion()).current;  // Video sensor instance
    const videoElementRef = useRef(null);  // Reference to the video element

    // Function to start emotion detection and video stream
    const startEmoDetection = useCallback(async () => {
        if (!videoElementRef.current) {
            console.error("Video element not provided.");
            return;
        }

        try {
            // Initialize video sensor with video element and start video stream
            videoToEmotion.initVideo(videoElementRef.current);
            await videoToEmotion.startVideoStream();
            setEmotionState((prev) => ({ ...prev, status: 'detecting' }));

            // Start continuous emotion detection
            videoToEmotion.startContinuousDetection((emotions) => {
                const emotionIntensities = {
                    joy: emotions.happy || 0,
                    anger: emotions.angry || 0,
                    disgust: emotions.disgusted || 0,
                    fear: emotions.fearful || 0,
                    sadness: emotions.sad || 0,
                    surprise: emotions.surprised || 0
                };
                const topEmotion = Object.keys(emotionIntensities).reduce((a, b) => emotionIntensities[a] > emotionIntensities[b] ? a : b);
                setEmotionState({
                    detectedEmotion: topEmotion,
                    emotionIntensities,
                    status: 'detecting'
                });
            });
        } catch (error) {
            console.error('Error starting emotion detection:', error);
        }
    }, [videoToEmotion]);

    // Function to stop emotion detection and video stream
    const stopEmoDetection = useCallback(() => {
        videoToEmotion.stopDetection();  // Stop emotion detection
        videoToEmotion.stopVideoStream();  // Stop video stream
        setEmotionState({ detectedEmotion: null, status: 'stopped', emotionIntensities: {} });
    }, [videoToEmotion]);

    // Return emotion state and control functions
    return {
        emotionState,
        startEmoDetection,
        stopEmoDetection,
        videoElementRef,  // Reference to be attached to video element
    };
};

export default useEmo;