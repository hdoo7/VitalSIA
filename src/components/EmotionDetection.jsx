import React, { useEffect } from 'react';
import useEmo from '../hooks/useEmo';
import DraggableVideoBox from './DraggableVideoBox';
import EmotionRadarChart from './EmotionRadarChart';  // Import radar chart component
import GameText from './GameText';
import { Box } from '@chakra-ui/react';

const EmotionDetection = () => {
    const { emotionState, startEmoDetection, stopEmoDetection, videoElementRef } = useEmo();

    // Start detection when component mounts and clean up when unmounting
    useEffect(() => {
        startEmoDetection();

        return () => {
            stopEmoDetection();
        };
    }, [startEmoDetection, stopEmoDetection]);

    return (
        <div>
            <DraggableVideoBox videoElementRef={videoElementRef} emotionState={emotionState} />
            <EmotionRadarChart emotionIntensities={emotionState.emotionIntensities} />
            <GameText text={emotionState.detectedEmotion || ''} />
        </div>
    );
};

export default EmotionDetection;