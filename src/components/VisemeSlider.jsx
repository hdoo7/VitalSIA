import React, { useState } from 'react';
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip, Text } from '@chakra-ui/react';
import * as d3 from 'd3';

const VisemeSlider = ({ viseme, name, intensity, notes, onChange, animationManager, setVisemeStates, visemePhoneme }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChange = (value) => {
    onChange(value);  // Update the state with the new value
    animationManager.applyVisemeChange(parseInt(viseme), value, 0);  // Apply the change to the animation system
    
    // Update the viseme state
    setVisemeStates(prev => ({
      ...prev,
      [viseme]: { ...prev[viseme], intensity: value }
    }));
  };

  // Color transition from teal to magenta using d3 for dynamic color based on intensity
  const colorScale = d3.scaleLinear()
    .domain([0, 100])
    .range(["teal", "magenta"]);

  return (
    <Box width="100%">
      <Text mb={2}>
        {name}
      </Text>
      
      <Slider
        value={intensity}  // Controlled value to make sure the slider reflects the state
        min={0}
        max={100}
        step={1}
        onChange={handleChange}  // Handle slider changes
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SliderTrack>
          <SliderFilledTrack bg={colorScale(intensity)} />  {/* Dynamic color */}
        </SliderTrack>
        <Tooltip
          hasArrow
          bg="teal.500"
          color="white"
          placement="top"
          isOpen={showTooltip}
          label={`${intensity}`}  // Show the current intensity
        >
          <SliderThumb />
        </Tooltip>
      </Slider>
    </Box>
  );
};

export default VisemeSlider;