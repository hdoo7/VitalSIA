import React, { useState, useMemo, useEffect } from 'react';
import {
  Drawer, DrawerBody, DrawerHeader, DrawerContent, DrawerCloseButton, IconButton,
  VStack, Box, Flex, Switch, Button, Text, useToast,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon
} from '@chakra-ui/react';
import AUSlider from './AUSlider';
import VisemeSlider from './VisemeSlider';
import { HamburgerIcon } from '@chakra-ui/icons';
import { ActionUnitsList, VisemesList } from '../unity/facs/shapeDict';

const SliderDrawer = ({ auStates, setAuStates, visemeStates, setVisemeStates, animationManager, drawerControls, setDrawerControls }) => {
  const toast = useToast();
  const [expandedItems, setExpandedItems] = useState([]);

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

  const auGroups = useMemo(() => ActionUnitsList.reduce((acc, au) => {
    (acc[au.faceSection || 'Other'] = acc[au.faceSection || 'Other'] || []).push(au);
    return acc;
  }, {}), []);

  const visemeGroups = useMemo(() => VisemesList.reduce((acc, viseme) => {
    (acc[viseme.faceSection || 'Other'] = acc[viseme.faceSection || 'Other'] || []).push(viseme);
    return acc;
  }, {}), []);

  useEffect(() => {
    if (!drawerControls.showUnusedSliders) {
      const activeSections = Object.values(auStates).reduce((sections, au, index) => {
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

  const handleVisemeChange = (id, value, notes) => {
    setVisemeStates(prevStates => ({
      ...prevStates,
      [id]: { ...prevStates[id], intensity: value, notes },
    }));
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
                  e.preventDefault();  // Prevent default form submission behavior
                  e.stopPropagation(); // Stop event from propagating to higher elements
                  setDrawerControls(prev => ({
                    ...prev,
                    showUnusedSliders: !prev.showUnusedSliders
                  }));
                }}
                colorScheme="teal"
              />
            </Flex>
            <Button colorScheme="teal" onClick={setFaceToNeutral}>Set Face to Neutral</Button>
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
                                  onChange={(value, notes) => {
                                    setAuStates(prevStates => ({
                                      ...prevStates,
                                      [au.id]: { ...prevStates[au.id], intensity: value, notes },
                                    }));
                                  }}
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
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Visemes
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack spacing={4}>
                    {Object.entries(visemeStates).map(([id, viseme]) => (
                      <Box key={id} mb={4}>
                        <Text>{viseme.name}</Text>
                        <VisemeSlider
                          viseme={id}
                          name={viseme.name}
                          intensity={viseme.intensity}
                          notes={viseme.notes}
                          animationManager={animationManager}
                          onChange={(value, notes) => {
                            setVisemeStates(prevStates => ({
                              ...prevStates,
                              [viseme.id]: { ...prevStates[viseme.id], intensity: value, notes },
                          }))
                          }}
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
    </>
  );
};

export default SliderDrawer;