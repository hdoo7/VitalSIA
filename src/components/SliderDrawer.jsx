import React, { useState, useEffect } from 'react';
import { useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerContent, DrawerCloseButton, IconButton, VStack, Box } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import AUSlider from './AUSlider'; // Ensure AUSlider is updated as per new requirements
import { ActionUnitsList } from '../unity/facs/shapeDict'; // Adjust the import path accordingly
import SpeachManager from '../VISOS/effectors/verbalizers/SpeachManager.js'

const SliderDrawer = ({ animationManager }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [auIntensities, setAuIntensities] = useState(ActionUnitsList.reduce((acc, au) => ({ ...acc, [au.id]: 0 }), {}));
  const [audio] = useState(new Audio(process.env.PUBLIC_URL + '/Window.mp3'));
  const speachManager = new SpeachManager(animationManager)
  const handleIntensityChange = (auId, value) => {
    setAuIntensities((prev) => ({ ...prev, [auId]: value }));
  };
  

  useEffect(() => {
    if (isOpen) {
      // Play audio for 1800ms when the drawer opens
      playAudio(0, 1800);
      speachManager.enqueueText(`Here you can adjust my facial action units, in order to test and validate existing theories, or to formulate new ones of your own! `)

    }
  }, [isOpen]);

  const playAudio = (start, duration) => {
    audio.currentTime = start;
    audio.play().catch((error) => console.error("Audio play error:", error));
    if (duration) {
      setTimeout(() => audio.pause(), duration);
    }
  };

  const handleClose = () => {
    // Play audio from 2.1s with no specific end time on close
    playAudio(2.1, 0);
    onClose();
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
        <DrawerContent backgroundColor="rgba(255, 255, 255, 0.5)"> {/* Adjust transparency here */}
          <DrawerCloseButton />
          <DrawerHeader className="headline">Adjust Animation Units</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {ActionUnitsList.map((au) => (
                <Box key={au.id} w="100%">
                  <AUSlider
                    au={au.id}
                    name={`${au.id} - ${au.name}`} // Include AU ID in the name
                    intensity={auIntensities[au.id]}
                    onChange={handleIntensityChange}
                    animationManager={animationManager}
                  />
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
