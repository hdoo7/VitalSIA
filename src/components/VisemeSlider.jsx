import React, { useState } from 'react';
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip, Text } from '@chakra-ui/react';
import * as d3 from 'd3';
import { on } from 'events';

const VisemeSlider = ({ viseme, name, intensity, notes, onChange, animationManager }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChange = (value) => {
    onChange(value);
    animationManager.applyVisemeChange(parseInt(viseme), value, 0);
  };

  // Color transition from teal to magenta using d3 for dynamic color based on intensity
  const colorScale = d3.scaleLinear()
    .domain([0, 100])
    .range(["teal", "magenta"]);

  return (
    <Box width="100%">
      <Text mb={2}>{name}</Text>
      
      <Slider
        defaultValue={intensity}
        min={0}
        max={100}
        step={1}
        onChange={handleChange}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SliderTrack>
          <SliderFilledTrack bg={colorScale(intensity)} />
        </SliderTrack>
        <Tooltip
          hasArrow
          bg="teal.500"
          color="white"
          placement="top"
          isOpen={showTooltip}
          label={`${intensity}`}
        >
          <SliderThumb />
        </Tooltip>
      </Slider>
    </Box>
  );
};
  
export default VisemeSlider;
