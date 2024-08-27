import React, { useState, useMemo, useEffect } from 'react';
import {
  Drawer, DrawerBody, DrawerHeader, DrawerContent, DrawerCloseButton, IconButton,
  VStack, Box, Flex, Switch, Button, Text, useToast,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  Input, HStack, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, useDisclosure
} from '@chakra-ui/react';
import { HamburgerIcon, DownloadIcon } from '@chakra-ui/icons';
import { FaUpload } from 'react-icons/fa';
import { ActionUnitsList, VisemesList } from '../unity/facs/shapeDict';
import AUSlider from './AUSlider';
import VisemeSlider from './VisemeSlider';
import TextAreaUI from './TextAreaUI';

const SliderDrawer = ({ auStates, setAuStates, visemeStates, setVisemeStates, animationManager, drawerControls, setDrawerControls }) => {
  const toast = useToast();
  const [expandedItems, setExpandedItems] = useState([]);
  const [segmentationMode, setSegmentationMode] = useState('section'); // New state for segmentation mode
  const { isOpen: isSaveOpen, onOpen: onSaveOpen, onClose: onSaveClose } = useDisclosure();
  const { isOpen: isLoadOpen, onOpen: onLoadOpen, onClose: onLoadClose } = useDisclosure();
  const [filename, setFilename] = useState('au-configuration.json');

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
      setExpandedItems([]); // Collapse all sections
    }
  };

  // Save AU Configuration with Non-Zero Intensities
  const saveConfiguration = () => {
    const nonZeroAUs = Object.entries(auStates)
      .filter(([_, au]) => au.intensity > 0)
      .map(([id, au]) => ({
        id,
        intensity: au.intensity / 90, // Scale down to match the expected input
        duration: 750, // Assuming a default duration, you may customize it as needed
        explanation: au.notes || "",
      }));
      
    const data = JSON.stringify(nonZeroAUs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Configuration Saved.",
      description: `Your AU configuration has been saved as ${filename}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onSaveClose();
  };

  // Load AU Configuration and Reset Face to Neutral
  const loadConfiguration = (event) => {
    const file = event.target.files[0];
    if (animationManager && animationManager.applyChangesFromJson) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFaceToNeutral();
        const config = e.target.result;
        animationManager.applyChangesFromJson(config);
        const parsedConfig = JSON.parse(config);
        const updatedStates = parsedConfig.reduce((acc, { id, intensity }) => {
          acc[id] = { intensity: intensity * 90, notes: "" }; // Scale back to match the internal state
          return acc;
        }, {});
        setAuStates(prev => ({ ...prev, ...updatedStates }));
        toast({
          title: "Configuration Loaded.",
          description: "Your AU configuration has been loaded.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Load Failed.",
        description: "The animation manager could not be found.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const auGroups = useMemo(() => {
    if (segmentationMode === 'section') {
      // Group by faceSection
      return ActionUnitsList.reduce((acc, au) => {
        (acc[au.faceSection || 'Other'] = acc[au.faceSection || 'Other'] || []).push(au);
        return acc;
      }, {});
    } else {
      // Group by faceArea ("Upper" or "Lower")
      return ActionUnitsList.reduce((acc, au) => {
        (acc[au.faceArea || 'Other'] = acc[au.faceArea || 'Other'] || []).push(au);
        return acc;
      }, {});
    }
  }, [segmentationMode]);

  const visemeGroups = useMemo(() => VisemesList.reduce((acc, viseme) => {
    (acc[viseme.faceSection || 'Other'] = acc[viseme.faceSection || 'Other'] || []).push(viseme);
    return acc;
  }, {}), []);

  useEffect(() => {
    if (!drawerControls.showUnusedSliders) {
      const activeSections = Object.values(auStates).reduce((sections, au) => {
        if (au.intensity > 0) {
          const section = ActionUnitsList.find(item => item.id === au.id)?.faceSection || 'Other';
          sections.add(section);
        }
        return sections;
      }, new Set());
      setExpandedItems([...activeSections]);
    }
  }, [auStates, drawerControls.showUnusedSliders]);

  const filteredSections = useMemo(() => {
    if (!drawerControls.showUnusedSliders) {
      return Object.entries(auGroups).filter(([section, aus]) =>
        aus.some(au => auStates[au.id]?.intensity > 0)
      );
    }
    return Object.entries(auGroups);
  }, [auGroups, auStates, drawerControls.showUnusedSliders]);

  const handleTextSubmit = (text) => {
    console.log("Submitted text:", text);
    if (animationManager && animationManager.speechManager) {
      animationManager.speechManager.enqueueText(text);
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
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Adjust Animation Units</DrawerHeader>
          <Flex direction="column" p={4} boxShadow="base" position="sticky" top={0} zIndex="sticky" bg="gray.50">
            <Flex justifyContent="space-between" mb={4} alignItems="center">
              <Text>Show Unused Sliders</Text>
              <Switch
                isChecked={drawerControls.showUnusedSliders}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDrawerControls(prev => ({
                    ...prev,
                    showUnusedSliders: !prev.showUnusedSliders
                  }));
                }}
                colorScheme="teal"
              />
            </Flex>
            <Flex justifyContent="space-between" mb={4} alignItems="center">
              <Text>Group by Face Area</Text>
              <Switch
                isChecked={segmentationMode === 'area'}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSegmentationMode(prev =>
                    prev === 'section' ? 'area' : 'section'
                  );
                }}
                colorScheme="teal"
              />
            </Flex>
            <Button colorScheme="teal" onClick={setFaceToNeutral} mb={4}>Set Face to Neutral</Button>
            <HStack spacing={4} justifyContent="space-between">
              <Button
                leftIcon={<DownloadIcon />}
                colorScheme="blue"
                onClick={onSaveOpen}
                size="sm"
                flex="1"
              >
                Save
              </Button>
              <Button
                leftIcon={<FaUpload />}
                colorScheme="green"
                onClick={onLoadOpen}
                size="sm"
                flex="1"
              >
                Load
              </Button>
            </HStack>
          </Flex>
          <DrawerBody>
            <Accordion allowMultiple defaultIndex={expandedItems.map(item => filteredSections.findIndex(([section]) => section === item))}>
              {filteredSections.map(([section, aus]) => (
                <AccordionItem key={section}>
                  {({ isExpanded }) => (
                    <>
                      <h2>
                        <AccordionButton onClick={() => {
                          if (isExpanded) {
                            setExpandedItems(current => current.filter(item => item !== section));
                          } else {
                            setExpandedItems(current => [...current, section]);
                          }
                        }}>
                          <Box flex="1" textAlign="left">
                            {section}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <VStack spacing={4}>
                          {aus.map(au => {
                            const auState = auStates[au.id];
                            return auState && (drawerControls.showUnusedSliders || auState.intensity > 0) ? (
                              <Box key={au.id} w="100%">
                                <AUSlider
                                  au={au.id}
                                  name={au.name}
                                  intensity={auState.intensity}
                                  notes={auState.notes}
                                  muscularBasis={ActionUnitsList[au.id]?.muscularBasis}
                                  links={ActionUnitsList[au.id]?.links}
                                  onChange={(value, notes) => {/* Handle intensity change */}}
                                  animationManager={animationManager}
                                />
                              </Box>
                            ) : null;
                          })}
                        </VStack>
                      </AccordionPanel>
                    </>
                  )}
                </AccordionItem>
              ))}
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Text Input
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <TextAreaUI onSubmit={handleTextSubmit} animationManager={animationManager} />
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Visemes
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <VStack spacing={4}>
                    {Object.entries(visemeStates).map(([id, visemeState]) => (
                      <Box key={id} w="100%">
                        <VisemeSlider
                          viseme={id}
                          name={VisemesList.find(v => v.id === id)?.name || id}
                          intensity={visemeState.intensity}
                          notes={visemeState.notes}
                          onChange={(value, notes) => {
                            setVisemeStates(prev => ({
                              ...prev,
                              [id]: { ...prev[id], intensity: value, notes }
                            }));
                            animationManager.applyVisemeChange(id, value, notes);
                          }}
                          animationManager={animationManager}
                        />
                      </Box>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Save Configuration Modal */}
      <Modal isOpen={isSaveOpen} onClose={onSaveClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Save Configuration</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Filename</FormLabel>
              <Input value={filename} onChange={(e) => setFilename(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={saveConfiguration}>
              Save
            </Button>
            <Button variant="ghost" onClick={onSaveClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Load Configuration Modal */}
      <Modal isOpen={isLoadOpen} onClose={onLoadClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Load Configuration</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Drag & Drop or Select a File</FormLabel>
              <Box border="2px dashed" borderColor="gray.300" p={6} rounded="md" textAlign="center">
                <Input
                  type="file"
                  accept=".json"
                  onChange={loadConfiguration}
                  display="none"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button leftIcon={<FaUpload />} as="span" size="sm" mt={2} colorScheme="teal">
                    Select File
                  </Button>
                </label>
              </Box>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SliderDrawer;