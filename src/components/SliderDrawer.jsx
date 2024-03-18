import React from 'react';
import {
  Drawer, DrawerBody, DrawerHeader, DrawerContent, DrawerCloseButton, IconButton,
  VStack, Box, Flex, Switch, Button, Text, Tooltip, useToast
} from '@chakra-ui/react';
import AUSlider from './AUSlider';
import { HamburgerIcon } from '@chakra-ui/icons';
import { ActionUnitsList } from '../unity/facs/shapeDict';

const SliderDrawer = ({ auStates, setAuStates, animationManager, drawerControls, setDrawerControls }) => {
  const toast = useToast();

  const handleIntensityChange = (auId, newValue, newNotes) => {
    setAuStates(prev => ({
      ...prev,
      [auId]: { ...prev[auId], intensity: newValue, notes: newNotes ?? prev[auId].notes }
    }));

    if (animationManager) {
      animationManager.applyAUChange(auId, newValue, 0);
    }
  };

  const setFaceToNeutral = () => {
    if (animationManager) {
      animationManager.setFaceToNeutral(750);
      toast({
        title: "Face reset to neutral.",
        description: "All action units have been reset.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      // Optionally reset notes when setting face to neutral
      const resetNotes = Object.keys(auStates).reduce((acc, key) => {
        acc[key] = { ...auStates[key], intensity: 0 }; // Reset intensity, keep notes
        return acc;
      }, {});
      setAuStates(resetNotes);
    }
  };

  return (
    <>
      <IconButton
        icon={<HamburgerIcon />}
        onClick={() => setDrawerControls({ isOpen: !drawerControls.isOpen })}
        position="fixed"
        top="1rem"
        left="1rem"
        zIndex="overlay"
      />
      <Drawer isOpen={drawerControls.isOpen} placement="left" onClose={() => setDrawerControls({ isOpen: false })} size="md">
        <DrawerContent backgroundColor="rgba(255, 255, 255, 0.5)">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Adjust Animation Units</DrawerHeader>
          <Flex direction="column" bg="gray.100" p={4} boxShadow="base" position="sticky" top={0} zIndex="sticky">
            <Flex justifyContent="space-between" mb={4}>
              <Text>Show Unused Sliders</Text>
              <Switch isChecked={drawerControls.showUnusedSliders} onChange={() => setDrawerControls({ showUnusedSliders: !drawerControls.showUnusedSliders })} colorScheme="teal" />
            </Flex>
            <Button colorScheme="teal" onClick={setFaceToNeutral}>Set Face to Neutral</Button>
          </Flex>
          <DrawerBody>
            <VStack spacing={4}>
              {Object.entries(auStates).filter(([_, au]) => drawerControls.showUnusedSliders || au.intensity !== 0).map(([auId, au]) => (
                <Box key={auId} w="100%">
                  <AUSlider
                    au={auId}
                    name={ActionUnitsList.find(item => item.id === auId)?.name || "Unknown"}
                    intensity={au.intensity}
                    notes={au.notes}
                    onChange={(value, notes) => handleIntensityChange(auId, value, notes)}
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
