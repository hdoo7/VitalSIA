import { useEffect } from 'react';
import { showHappy, showSad, showAngry, showFear, showSurprise, showDisgust } from '../VISOS/action/visualizers/basicEmotions';

const useMirroring = (animationManager, emotionState) => {
    // Effect to mirror emotions based on the detected emotion state passed from EmotionDetection
    useEffect(() => {
        if (emotionState && emotionState.detectedEmotion) {
            const { detectedEmotion, emotionIntensities } = emotionState;

            console.log('Detected Emotion:', detectedEmotion);  // Debug log to track detected emotions
            console.log('Emotion Intensity:', emotionIntensities[detectedEmotion]);  // Log the intensity of the detected emotion

            // Map the detected emotion and its intensity to the agent's facial expressions
            mirrorEmotionToAgent(detectedEmotion, emotionIntensities[detectedEmotion], animationManager);
        }
    }, [emotionState, animationManager]);

    // Function to mirror the detected emotion to the agent based on intensity
    const mirrorEmotionToAgent = (emotion, intensity, animationManager) => {
        console.log(`Mirroring ${emotion} with intensity: ${intensity}`);  // Log the emotion being mirrored

        // Apply slower reaction for negative emotions
        let delay = emotion === 'joy' || emotion === 'surprise' ? 0 : 2000;

        switch (emotion) {
            case 'joy':
                showHappy(animationManager, intensity * 100, 500);  // Scale the intensity for facial expressions
                break;
            case 'sadness':
                setTimeout(() => {
                    showSad(animationManager, intensity * 100, 500);
                }, delay);
                break;
            case 'anger':
                setTimeout(() => {
                    showAngry(animationManager, intensity * 100, 700);
                }, delay);
                break;
            case 'surprise':
                showSurprise(animationManager, intensity * 100, 300);
                break;
            case 'fear':
                setTimeout(() => {
                    showFear(animationManager, intensity * 100, 700);
                }, delay);
                break;
            case 'disgust':
                setTimeout(() => {
                    showDisgust(animationManager, intensity * 100, 700);
                }, delay);
                break;
            default:
                console.log('No valid emotion detected');
                break;
        }
    };

    return null;  // No need to return anything since this is a side-effect hook
};

export default useMirroring;