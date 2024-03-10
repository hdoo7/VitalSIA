// AUSlider.jsx
import React from 'react';
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip, Text } from '@chakra-ui/react';

const AUSlider = ({ au, name, intensity, onChange, animationManager }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  const handleIntensityChange = (value) => {
    onChange(au, value); // Update the parent component's state with AU ID and value
    animationManager.scheduleChange(au, value, 250, 0); // Adjust AU intensity in Unity
  };

  return (
    <Box>
      <Text mb="2">{name}</Text>
      <Slider id={au} defaultValue={intensity} min={0} max={100} colorScheme="teal" 
              onMouseEnter={() => setShowTooltip(true)} 
              onMouseLeave={() => setShowTooltip(false)}
              onChange={handleIntensityChange}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <Tooltip hasArrow bg="teal.500" color="white" placement="top" isOpen={showTooltip} label={`${intensity}%`}>
          <SliderThumb />
        </Tooltip>
      </Slider>
    </Box>
  );
};

export default AUSlider;
