import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Button, IconButton, Text, Switch, Tooltip, Flex, Accordion, AccordionItem,
    AccordionButton, AccordionPanel, AccordionIcon
} from '@chakra-ui/react';
import { InfoIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import appsConfig from '../modules/config';
import ConfigModal from './ConfigModal';

const ModulesMenu = ({ animationManager }) => {
    const [selectedApp, setSelectedApp] = useState(null);
    const [appSettings, setAppSettings] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const containerRef = useRef(null);

    // Load settings from localStorage or use default from config
    useEffect(() => {
        const initialSettings = {};
        appsConfig.apps.forEach(app => {
            const storedSettings = localStorage.getItem(app.name);
            initialSettings[app.name] = storedSettings ? JSON.parse(storedSettings) : { ...app.settings };
        });
        setAppSettings(initialSettings);
    }, []);

    // Save settings to localStorage
    const saveSettingsToLocalStorage = () => {
        Object.keys(appSettings).forEach(appName => {
            localStorage.setItem(appName, JSON.stringify(appSettings[appName]));
        });
    };

    const handleSwitchChange = (app, isChecked) => {
        import(`../modules/${app.path}`).then(module => {
            if (isChecked) {
                if (!containerRef.current) {
                    console.error('App container reference is invalid. Unable to start the app.');
                    return;
                }
                module.start(animationManager, appSettings[app.name], containerRef);
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

    const handleSaveConfig = () => {
        saveSettingsToLocalStorage();
        setIsModalOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Box position="fixed" right="1rem" top="1rem" bg="white" p={4} borderRadius="md" boxShadow="lg">
            <Flex justify="space-between" align="center">
                <Text fontSize="xl" mb={4}>Modules</Text>
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
            <Box ref={containerRef} id="app-container" /> {/* Container for the apps */}
            {selectedApp && (
                <ConfigModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSave={handleSaveConfig} // Save on button click
                    app={selectedApp}
                    settings={appSettings[selectedApp.name]}
                    handleInputChange={handleInputChange}
                    handleNumberInputChange={handleNumberInputChange}
                />
            )}
        </Box>
    );
};

export default ModulesMenu;