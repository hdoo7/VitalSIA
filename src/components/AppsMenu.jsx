import React, { useState, useEffect } from 'react';
import {
    Box, Button, IconButton, Text, Switch, Tooltip, Flex, Accordion, AccordionItem,
    AccordionButton, AccordionPanel, AccordionIcon
} from '@chakra-ui/react';
import { InfoIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import appsConfig from '../apps/config';
import ConfigModal from './ConfigModal';

const AppsMenu = ({ animationManager, ml }) => {
    const [selectedApp, setSelectedApp] = useState(null);
    const [appSettings, setAppSettings] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const initialSettings = {};
        appsConfig.apps.forEach(app => {
            initialSettings[app.name] = { ...app.settings };
        });
        setAppSettings(initialSettings);
    }, []);

    const handleSwitchChange = (app, isChecked) => {
        import(`../apps/${app.path}`).then(module => {
            if (isChecked) {
                module.start(animationManager, appSettings[app.name]);
            } else {
                module.stop(animationManager);
            }
        });
    };

    const handleConfigClick = (app) => {
        setSelectedApp(app);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedApp(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAppSettings(prevSettings => ({
            ...prevSettings,
            [selectedApp.name]: {
                ...prevSettings[selectedApp.name],
                [name]: value,
            },
        }));
    };

    const handleNumberInputChange = (name, value) => {
        setAppSettings(prevSettings => ({
            ...prevSettings,
            [selectedApp.name]: {
                ...prevSettings[selectedApp.name],
                [name]: value,
            },
        }));
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
                <ConfigModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    app={selectedApp}
                    settings={appSettings[selectedApp.name]}
                    handleInputChange={handleInputChange}
                    handleNumberInputChange={handleNumberInputChange}
                />
            )}
        </Box>
    );
};

export default AppsMenu;