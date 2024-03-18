import React, { useState, useEffect } from 'react';
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip, Text, useColorModeValue } from '@chakra-ui/react';
import * as d3 from 'd3';

const AUSlider = ({ au, name, intensity, notes, onChange, animationManager }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [lastIntensity, setLastIntensity] = useState(intensity);

  // Color transition from teal to magenta using d3 for dynamic color based on intensity
  const colorScale = d3.scaleLinear()
    .domain([0, 100])
    .range(["teal", "magenta"]);

  const handleIntensityChange = (value) => {
    onChange(au, value); // Notify parent component about the change
    // Check if the change in intensity is significant
    if (Math.abs(value - lastIntensity) > 10) {
      // Here you could update the global state with the new notes, if necessary
      // For example, setGlobalNotes(newNotes); if you have such a function available
    }
    setLastIntensity(value);
  };

  return (
    <Box width="100%">
      <Text fontFamily="'Lily Script', cursive" mb="2">{`${au} - ${name}`}</Text>
      <Slider 
        id={au} 
        value={intensity} // Controlled by parent's state
        min={0} 
        max={100}
        onMouseEnter={() => setShowTooltip(true)} 
        onMouseLeave={() => setShowTooltip(false)}
        onChange={handleIntensityChange} // Use onChange for real-time updates
        colorScheme={useColorModeValue("teal", "magenta")}>
        <SliderTrack>
          <SliderFilledTrack bg={colorScale(intensity)} />
        </SliderTrack>
        <Tooltip hasArrow label={`${intensity}%`} bg="gray.300" color="black" placement="top" isOpen={showTooltip}>
          <SliderThumb boxSize={6} />
        </Tooltip>
      </Slider>
      {/* Display local notes if they exist */}
      {notes && <Text mt="2" fontSize="sm">{notes}</Text>}
    </Box>
  );
};

export default AUSlider;
