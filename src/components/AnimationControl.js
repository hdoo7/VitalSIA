import React from 'react';
import {
  Button,
  Stack,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import { RepeatIcon, SmallCloseIcon, TriangleUpIcon } from '@chakra-ui/icons';

const AnimationControl = ({ animationManager }) => {
  const toast = useToast();

  const handlePlay = () => {
    animationManager.play();
    toast({
      title: "Animation started",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handlePause = () => {
    animationManager.pause();
    toast({
      title: "Animation paused",
      status: "warning",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleSetFaceToNeutral = () => {
    animationManager.setFaceToNeutral(750);
    toast({
      title: "Face reset to neutral.",
      description: "All action units have been reset.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Stack direction="row" spacing={4}>
      <IconButton
        aria-label="Play animation"
        icon={<TriangleUpIcon />} // Used as a play icon substitute
        colorScheme="teal"
        onClick={handlePlay}
      />
      <IconButton
        aria-label="Pause animation"
        icon={<SmallCloseIcon />} // Used as a pause icon substitute
        colorScheme="orange"
        onClick={handlePause}
      />
      <IconButton
        aria-label="Reset face to neutral"
        icon={<RepeatIcon />} // Appropriate for a reset action
        colorScheme="red"
        onClick={handleSetFaceToNeutral}
      />
    </Stack>
  );
};

export default AnimationControl;
