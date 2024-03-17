import React, { useState, useEffect } from 'react';
import { useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerContent, DrawerCloseButton, IconButton, VStack, Box } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import AUSlider from './AUSlider'; // Ensure the path is correct for your project structure
import { ActionUnitsList } from '../unity/facs/shapeDict'; // Ensure the path is correct for your project structure
import SpeechManager from '../VISOS/effectors/verbalizers/SpeechManager.js'; // Ensure the path is correct for your project structure

const SliderDrawer = ({ auStates, setAuStates, animationManager }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  useEffect(() => {
    // If there are specific actions to be taken when the drawer opens or closes, handle them here.
    // For example, playing audio or initializing certain states.
  }, [isOpen]);

  // This function or similar was expected to handle AU intensity changes through sliders
  const handleIntensityChange = (auId, newValue) => {
    setAuStates(prev => ({
      ...prev,
      [auId]: { ...prev[auId], intensity: newValue }
    }));

    // Assuming animationManager has a method to handle individual AU changes immediately
    if (animationManager) {
      animationManager.applyAUChange(auId, newValue, 0); // Duration set to 0 for immediate application
    }
  };

  return (
    <>
      <IconButton
        icon={<HamburgerIcon />}
        onClick={onOpen}
        position="fixed"
        top="1rem"
        left="1rem"
        zIndex="overlay"
      />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="md">
        <DrawerContent backgroundColor="rgba(255, 255, 255, 0.5)">
          <DrawerCloseButton />
          <DrawerHeader>Adjust Animation Units</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              {Object.entries(auStates).map(([auId, { intensity, notes }]) => (
                <Box key={auId} w="100%">
                  <AUSlider
                    au={auId}
                    name={ActionUnitsList.find(au => au.id === auId)?.name || auId}
                    intensity={intensity}
                    onChange={handleIntensityChange}
                    animationManager={animationManager}
                  />
                  {/* Display notes if available */}
                  {notes && <p>{notes}</p>}
                </Box>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SliderDrawer;
