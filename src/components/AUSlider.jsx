import React, { useState, useEffect } from 'react';
import {
  Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip, Text,
  useColorModeValue, Image, Link
} from '@chakra-ui/react';
import * as d3 from 'd3';

const AUSlider = ({ au, name, intensity, notes, onChange, animationManager, muscularBasis, links }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [showImageTooltip, setShowImageTooltip] = useState(false);

  // Color transition from teal to magenta using d3 for dynamic color based on intensity
  const colorScale = d3.scaleLinear()
    .domain([0, 100])
    .range(["teal", "magenta"]);

  const fetchMainImageFromWikipedia = async (pageUrl) => {
    const pageName = pageUrl.split('/wiki/')[1];
    if (!pageName) return null;

    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${pageName}&prop=pageimages&format=json&origin=*&pithumbsize=100`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const page = data.query.pages[Object.keys(data.query.pages)[0]];
      return page.thumbnail ? page.thumbnail.source : null;
    } catch (error) {
      console.error("Failed to fetch Wikipedia image:", error);
      return null;
    }
  };

  const handleIntensityChange = (value) => {
    // Notify parent component about the change
    // Check if the change in intensity is significant
    if (animationManager) {
      animationManager.applyAUChange(au, value, 0);
    }
  
};
  useEffect(() => {
    const fetchImages = async () => {
      const validLinks = Array.isArray(links) ? links : [];
      const fetchedImageUrls = await Promise.all(validLinks.map(link => fetchMainImageFromWikipedia(link)));
      setImageUrls(fetchedImageUrls.filter(url => url !== null));
    };

    fetchImages();
  }, [links]);

  return (
    <Box width="100%">
      <Text fontFamily="sans-serif" mb="2" display="inline">
        {`${au} - ${name}`}
        <Tooltip label={muscularBasis?.split(', ').map((muscle, index) => (
          <Box key={index}>
            {imageUrls[index] ? <Image src={imageUrls[index]} alt={muscle} boxSize="100px" /> : muscle}
          </Box>
        ))} isOpen={showImageTooltip} hasArrow>
          <Text as="span" fontSize="sm" ml={2} onMouseEnter={() => setShowImageTooltip(true)} onMouseLeave={() => setShowImageTooltip(false)} style={{ textDecoration: "underline", cursor: "pointer" }}>
            {muscularBasis}
          </Text>
        </Tooltip>
      </Text>
      <Slider
        id={au}
        value={intensity}
        min={0}
        max={100}
        onChange={handleIntensityChange}
        colorScheme={useColorModeValue("teal", "magenta")}>
        <SliderTrack>
          <SliderFilledTrack bg={colorScale(intensity)} />
        </SliderTrack>
        <Tooltip hasArrow label={`${intensity}%`} bg="gray.300" color="black" placement="top">
          <SliderThumb boxSize={6} />
        </Tooltip>
      </Slider>
      {notes && <Text mt="2" fontSize="sm">{notes}</Text>}
    </Box>
  );
};

export default AUSlider;
