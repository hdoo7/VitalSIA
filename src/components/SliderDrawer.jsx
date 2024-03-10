// SliderDrawer.jsx
import React, { useState } from 'react';
import { useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, IconButton, VStack } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import AUSlider from './AUSlider'; // Assuming AUSlider component is correctly implemented
import { ActionUnitsList } from '../unity/facs/shapeDict'; // Adjust the import path accordingly

const SliderDrawer = ({ animationManager }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [auIntensities, setAuIntensities] = useState(ActionUnitsList.reduce((acc, au) => ({ ...acc, [au.id]: 0 }), {}));

  const handleIntensityChange = (auId, value) => {
    setAuIntensities((prev) => ({ ...prev, [auId]: value }));
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
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Adjust Animation Units</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              {ActionUnitsList.map((au) => (
                <AUSlider
                  key={au.id}
                  au={au.id}
                  name={au.name}
                  intensity={auIntensities[au.id]}
                  onChange={handleIntensityChange}
                  animationManager={animationManager}
                />
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SliderDrawer;
