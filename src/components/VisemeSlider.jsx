import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip, Text } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text } from '@chakra-ui/react';

const VisemeSlider = ({ viseme, name, intensity, notes, onChange, animationManager }) => {
  const handleChange = (value) => {
    
    animationManager.scheduleVisemeChange(parseInt(viseme), value, 0).then(() => {
      animationManager.facsLib.updateEngine();
  }); // Adjust duration as needed
  };

  return (
    <Box>
      <Text>{viseme}: {name}</Text>
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
