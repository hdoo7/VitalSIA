import React, { useCallback, useEffect } from 'react';
import { useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerContent, DrawerCloseButton, IconButton, VStack, Box } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import AUSlider from './AUSlider';
import { useUnityState } from '../unityMiddleware'; // Adjust the import path as necessary

const SliderDrawer = ({ auStates, setAuStates }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { animationManager } = useUnityState(); // Use the animationManager from Unity context

  useEffect(() => {
    if (isOpen && animationManager) {
      // Example usage if needed when the drawer is open
      console.log('Drawer is open and animationManager is available');
    }
  }, [isOpen, animationManager]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleIntensityChange = useCallback((auId, newValue) => {
    setAuStates(prev => ({ ...prev, [auId]: { ...prev[auId], intensity: newValue }}));
    // Here you can also add logic to interact with animationManager if needed
  }, [setAuStates]);

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
      <Drawer isOpen={isOpen} placement="left" onClose={handleClose} size="md">
        <DrawerContent backgroundColor="rgba(255, 255, 255, 0.5)">
          <DrawerCloseButton />
          <DrawerHeader>Adjust Animation Units</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              {Object.entries(auStates).map(([auId, { intensity, notes }]) => (
                <Box key={auId} w="100%">
                  <AUSlider
                    au={auId}
                    intensity={intensity}
                    onChange={handleIntensityChange}
                    // No longer need to pass animationManager here unless AUSlider uses it
                  />
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
