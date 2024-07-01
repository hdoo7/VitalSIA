import React, { useState } from 'react';
import {
    Box, Button, IconButton, Text, Switch, Tooltip, Flex, Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, Accordion, AccordionItem,
    AccordionButton, AccordionPanel, AccordionIcon, NumberInput, NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper
} from '@chakra-ui/react';
import { InfoIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import appsConfig from '../apps/config';

const AppsMenu = ({ animationManager, ml }) => {
    const [selectedApp, setSelectedApp] = useState(null);
    const [appSettings, setAppSettings] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSwitchChange = (app, isChecked) => {
        import(`../apps/${app.path}`).then(module => {
            if (isChecked) {
                module.start(animationManager, appSettings);
            } else {
                module.stop(animationManager);
            }
        });
    };

    const handleConfigClick = (app) => {
        setSelectedApp(app);
        const initialSettings = {};
        Object.keys(app.settings).forEach(setting => {
            initialSettings[app.settings[setting].name] = app.settings[setting].default;
        });
        setAppSettings(initialSettings);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedApp(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAppSettings(prevSettings => ({ ...prevSettings, [name]: value }));
    };

    const handleNumberInputChange = (name, value) => {
        setAppSettings(prevSettings => ({ ...prevSettings, [name]: value }));
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Box position="fixed" right="1rem" top="1rem" ml={ml} bg="white" p={4} borderRadius="md" boxShadow="lg">
            <Flex justify="space-between" align="center">
                <Text fontSize="xl" mb={4}>Applications</Text>
                <IconButton
                    icon={isMenuOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    onClick={toggleMenu}
                    variant="outline"
                    size="sm"
                />
            </Flex>
            {isMenuOpen && (
                <Accordion allowMultiple>
                    {appsConfig.apps.map((app, index) => (
                        <AccordionItem key={index}>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">{app.name}</Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Flex align="center" justify="space-between" mb={2}>
                                    <Tooltip label={app.description} placement="top">
                                        <InfoIcon />
                                    </Tooltip>
                                    <Switch onChange={(e) => handleSwitchChange(app, e.target.checked)} />
                                    <Button size="sm" onClick={() => handleConfigClick(app)}>Config</Button>
                                </Flex>
                            </AccordionPanel>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
            {selectedApp && (
                <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{selectedApp.name} Settings</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {Object.keys(selectedApp.settings).map((setting, index) => (
                                <FormControl key={index} mb={4}>
                                    <FormLabel>{selectedApp.settings[setting]?.description}</FormLabel>
                                    {selectedApp.settings[setting]?.type === 'number' ? (
                                        <NumberInput
                                            name={selectedApp.settings[setting].name}
                                            value={appSettings[selectedApp.settings[setting].name]}
                                            onChange={(valueString, valueNumber) => handleNumberInputChange(selectedApp.settings[setting].name, valueNumber)}
                                        >
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    ) : (
                                        <Input
                                            type={selectedApp.settings[setting].type}
                                            name={selectedApp.settings[setting].name}
                                            value={appSettings[selectedApp.settings[setting].name]}
                                            onChange={handleInputChange}
                                        />
                                    )}
                                </FormControl>
                            ))}
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={handleModalClose}>
                                Save
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </Box>
    );
};

export default AppsMenu;