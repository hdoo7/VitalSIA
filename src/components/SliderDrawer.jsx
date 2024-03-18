import React, { useState, useEffect } from 'react';
import {
  useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerContent,
  DrawerCloseButton, IconButton, VStack, Box, Flex, Switch, Button,
  Spacer, Text, useToast
} from '@chakra-ui/react';
import AUSlider from './AUSlider';
import { HamburgerIcon } from '@chakra-ui/icons';
import { ActionUnitsList } from '../unity/facs/shapeDict';

const SliderDrawer = ({ auStates, setAuStates, animationManager }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showAllSliders, setShowAllSliders] = useState(false);
  const toast = useToast();

  useEffect(() => {}, [isOpen]);

  const handleIntensityChange = (auId, newValue) => {
    setAuStates(prev => ({
      ...prev,
      [auId]: { ...prev[auId], intensity: newValue }
    }));

    if (animationManager) {
      animationManager.applyAUChange(auId, newValue, 0); // Immediate application
    }
  };

  const toggleShowAllSliders = () => setShowAllSliders(!showAllSliders);

  const setFaceToNeutral = () => {
    if (animationManager) {
      animationManager.setFaceToNeutral(750); // Adjust duration as needed
      toast({
        title: "Face reset to neutral.",
        description: "All action units have been reset.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      // Reset notes when setting face to neutral
      const resetNotes = Object.keys(auStates).reduce((acc, key) => {
        acc[key] = { ...auStates[key], intensity: 0, notes: auStates[key].notes };
        return acc;
      }, {});
      setAuStates(resetNotes);
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
          <DrawerHeader borderBottomWidth="1px">Adjust Animation Units</DrawerHeader>
          {/* Control Box */}
          <Flex bg="gray.100" p={4} boxShadow="md" justifyContent="space-between" alignItems="center" position="sticky" top={0} zIndex="sticky">
            <Text>Show All Sliders</Text>
            <Switch isChecked={showAllSliders} onChange={toggleShowAllSliders} colorScheme="teal" />
            <Button colorScheme="teal" onClick={setFaceToNeutral}>Set Face to Neutral</Button>
          </Flex>
          <DrawerBody>
            <VStack spacing={4}>
              {Object.entries(auStates).map(([auId, { intensity, notes }]) => {
                if (!showAllSliders && intensity === 0) return null;
                return (
                  <Box key={auId} w="100%">
                    <AUSlider
                      au={auId}
                      name={ActionUnitsList.find(au => au.id === auId)?.name || auId}
                      intensity={intensity}
                      notes={notes}
                      onChange={(value) => handleIntensityChange(auId, value)}
                      animationManager={animationManager}
                    />
                    {/* Display notes if available */}
                    {notes && <Text mt="2" fontSize="sm" color="gray.600">{notes}</Text>}
                  </Box>
                );
              })}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SliderDrawer;
