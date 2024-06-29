import React, { useState } from 'react';
import { Box, Button, Text, Switch, Tooltip, Flex, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import appsConfig from '../apps/config';

const AppsMenu = ({ animationManager, ml }) => {
    const [selectedApp, setSelectedApp] = useState(null);
    const [appSettings, setAppSettings] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSwitchChange = (app, isChecked) => {
        if (isChecked) {
            // Assuming each app module exports a start function
            import(`../apps/${app.path}`).then(module => module.start(animationManager, appSettings));
        } else {
            import(`../apps/${app.path}`).then(module => module.stop(animationManager));
        }
    };

    const handleConfigClick = (app) => {
        setSelectedApp(app);
        setAppSettings(app.settings.reduce((acc, setting) => ({
            ...acc, [setting.name]: setting.default,
        }), {}));
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

    return (
        <Box position="fixed" right="1rem" top="1rem" ml={ml} bg="white" p={4} borderRadius="md" boxShadow="lg">
            <Text fontSize="xl" mb={4}>Applications</Text>
            {appsConfig.apps.map((app, index) => (
                <Box key={index} mb={4}>
                    <Flex align="center" justify="space-between">
                        <Text>{app.name}</Text>
                        <Tooltip label={app.description} placement="top">
                            <InfoIcon />
                        </Tooltip>
                        <Switch onChange={(e) => handleSwitchChange(app, e.target.checked)} />
                        <Button size="sm" onClick={() => handleConfigClick(app)}>Config</Button>
                    </Flex>
                </Box>
            ))}
            {selectedApp && (
                <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{selectedApp.name} Settings</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {selectedApp.settings.map((setting, index) => (
                                <FormControl key={index} mb={4}>
                                    <FormLabel>{setting.description}</FormLabel>
                                    <Input
                                        type={setting.type}
                                        name={setting.name}
                                        value={appSettings[setting.name]}
                                        onChange={handleInputChange}
                                    />
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