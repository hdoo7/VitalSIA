import React, { useState } from 'react';
import { useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerContent, DrawerCloseButton, IconButton, VStack, Box } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import AUSlider from './AUSlider'; // Ensure AUSlider is updated as per new requirements
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
