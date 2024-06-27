import React, { useState } from 'react';
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip, Text } from '@chakra-ui/react';
import * as d3 from 'd3';

const VisemeSlider = ({ viseme, name, intensity, notes, onChange, animationManager }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChange = (value) => {
    onChange(value, notes);
    animationManager.scheduleVisemeChange(viseme, value, 750); // Adjust duration as needed
  };

  // Color transition from teal to magenta using d3 for dynamic color based on intensity
  const colorScale = d3.scaleLinear()
    .domain([0, 100])
    .range(["teal", "magenta"]);

  return (
    <Box width="100%">
      <Text mb={2}>{name}</Text>
      <Slider
        value={intensity}
        min={0}
        max={100}
        step={1}
        onChange={handleChange}
        colorScheme={useColorModeValue("teal", "magenta")}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        width="100%"
      >
        <SliderTrack bg="gray.200">
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
          <SliderThumb boxSize={6} />
        </Tooltip>
      </Slider>
    </Box>
  );
};
      <Text mb={2}>{name}</Text>
      <svg width="0" height="0">
        <defs>{gradient}</defs>
      </svg>
      <Slider
        defaultValue={intensity}
        min={0}
        max={100}
        step={1}
        onChange={handleChange}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SliderTrack bg="gray.200">
          <SliderFilledTrack bg={`url(#${gradientId})`} />
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
