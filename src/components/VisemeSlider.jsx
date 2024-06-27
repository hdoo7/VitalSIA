import React from 'react';
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text } from '@chakra-ui/react';

const VisemeSlider = ({ viseme, name, intensity, notes, onChange, animationManager }) => {
  const handleChange = (value) => {
    onChange(value, notes);
    animationManager.scheduleVisemeChange(viseme, value, 0); // Adjust duration as needed
  };

  return (
    <Box>
      <Text>{name}</Text>
      <Slider value={intensity} min={0} max={100} onChange={handleChange}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
};

export default VisemeSlider;