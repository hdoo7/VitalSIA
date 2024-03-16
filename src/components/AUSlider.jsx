import React from 'react';
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip, Text, useColorModeValue } from '@chakra-ui/react';
import * as d3 from 'd3';

const AUSlider = ({ au, name, intensity, onChange, animationManager }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  // Color transition from teal to magenta using d3 for dynamic color based on intensity
  const colorScale = d3.scaleLinear()
    .domain([0, 100])
    .range(["teal", "magenta"]);

  const handleIntensityChange = (value) => {
    onChange(au, value); // Update the parent component's state with AU ID and value
    animationManager.scheduleChange(au, value, 250, 0); // Adjust AU intensity in Unity
  };

  return (
    <Box width="100%">
      <Text fontFamily="'Lily Script', cursive" mb="2">{`${au} - ${name}`}</Text>
      <Slider id={au} defaultValue={intensity} min={0} max={100}
              onMouseEnter={() => setShowTooltip(true)} 
              onMouseLeave={() => setShowTooltip(false)}
              onChangeEnd={handleIntensityChange} // Consider using onChangeEnd for final value
              colorScheme={useColorModeValue("teal", "magenta")}>
        <SliderTrack>
          <SliderFilledTrack bg={colorScale(intensity)} />
        </SliderTrack>
        <Tooltip hasArrow label={`${intensity}%`} bg="gray.300" color="black" placement="top" isOpen={showTooltip}>
          <SliderThumb boxSize={6} />
        </Tooltip>
      </Slider>
    </Box>
  );
};

export default AUSlider;
