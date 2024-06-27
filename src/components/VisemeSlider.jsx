import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip, Text } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text } from '@chakra-ui/react';

const VisemeSlider = ({ viseme, name, intensity, notes, onChange, animationManager }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChange = (value) => {
    onChange(value, notes);
    animationManager.scheduleVisemeChange(viseme, value, 750); // Adjust duration as needed
  };

  // Define the gradient for the slider
  const gradientId = `grad-${viseme}`;
  const gradient = (
    <linearGradient id={gradientId}>
      <stop offset="0%" stopColor="blue" />
      <stop offset="100%" stopColor="red" />
    </linearGradient>
  );

  return (
    <Box w="100%">
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
  );
};

export default VisemeSlider;
