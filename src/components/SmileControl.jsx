import React from 'react';
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Text
} from '@chakra-ui/react';

function SmileControl({ animationManager }) {
  const handleSliderChange = (value) => {
    // Assuming 'smile' function accepts an intensity parameter
    // Adjust this logic based on how your animation system is set up
    animationManager.scheduleChange("12", value, 250, 0);
  };

  return (
    <Box p={4}>
      <Text mb="8px">Adjust Smile Intensity:</Text>
      <Slider defaultValue={88} min={0} max={100} onChange={handleSliderChange}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
}

export default SmileControl;
