import { useEffect } from 'react';
import { showHappy, showSad, showAngry, showFear, showSurprise, showDisgust } from '../VISOS/action/visualizers/basicEmotions';

const useDiscreteMirroring = (animationManager, emotionState) => {
    // Effect to mirror emotions based on the detected emotion state passed from EmotionDetection
    useEffect(() => {
        if (emotionState && emotionState.detectedEmotion) {
            const { detectedEmotion } = emotionState;

            console.log('Discrete Detected Emotion:', detectedEmotion);  // Debug log to track detected emotions

            // Reset the face to neutral before applying new emotion
            animationManager.setFaceToNeutral();

            // Map the detected emotion to the agent's facial expressions with predefined states
            mirrorDiscreteEmotionToAgent(detectedEmotion, animationManager);
        }
    }, [emotionState, animationManager]);

    // Function to mirror the detected emotion to the agent using predefined expressions
    const mirrorDiscreteEmotionToAgent = (emotion, animationManager) => {
        let delay = emotion === 'joy' || emotion === 'surprise' ? 0 : 2000;  // Delay for negative emotions

        switch (emotion) {
            case 'joy':
                console.log('Mirroring Joy on Agent with fixed intensity');
                showHappy(animationManager, 100, 500);  // Fixed intensity for joy
                break;
            case 'sadness':
                console.log('Mirroring Sadness on Agent with fixed intensity');
                setTimeout(() => {
                    showSad(animationManager, 100, 500);  // Fixed intensity for sadness
                }, delay);
                break;
            case 'anger':
                console.log('Mirroring Anger on Agent with fixed intensity');
                setTimeout(() => {
                    showAngry(animationManager, 100, 700);  // Fixed intensity for anger
                }, delay);
                break;
            case 'surprise':
                console.log('Mirroring Surprise on Agent with fixed intensity');
                showSurprise(animationManager, 100, 300);  // Fixed intensity for surprise
                break;
            case 'fear':
                console.log('Mirroring Fear on Agent with fixed intensity');
                setTimeout(() => {
                    showFear(animationManager, 100, 700);  // Fixed intensity for fear
                }, delay);
                break;
            case 'disgust':
                console.log('Mirroring Disgust on Agent with fixed intensity');
                setTimeout(() => {
                    showDisgust(animationManager, 100, 700);  // Fixed intensity for disgust
                }, delay);
                break;
            default:
                console.log('No valid emotion detected');
                break;
        }
    };

    return null;  // No need to return anything since this is a side-effect hook
};

export default useDiscreteMirroring;