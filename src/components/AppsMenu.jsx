import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Button, IconButton, Text, Switch, Tooltip, Flex, Accordion, AccordionItem,
    AccordionButton, AccordionPanel, AccordionIcon
} from '@chakra-ui/react';
import { InfoIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import appsConfig from '../apps/config';
import ConfigModal from './ConfigModal';

// Dynamically load the apps/modules using require.context
const appModules = require.context('../apps', false, /\.js$/);
const visosModules = require.context('../VISOS', true, /\.js$/);

const AppsMenu = ({ animationManager, ml }) => {
    const [selectedApp, setSelectedApp] = useState(null);
    const [appSettings, setAppSettings] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const containerRef = useRef(null); // Reference to the container where apps will be rendered

    useEffect(() => {
        const initialSettings = {};
        appsConfig.apps.forEach(app => {
            initialSettings[app.name] = { ...app.settings };
        });
        setAppSettings(initialSettings);
    }, []);

    const handleSwitchChange = (app, isChecked) => {
        const modulePath = `./${app.path}.js`;

        // Dynamically load the app
        if (appModules.keys().includes(modulePath)) {
            const module = appModules(modulePath);

            if (isChecked) {
                if (!containerRef.current) {
                    console.error('App container reference is invalid. Unable to start the app.');
                    return;
                }
                module.start(animationManager, appSettings[app.name], containerRef);
            } else {
                module.stop(animationManager);
            }
        } else {
            console.error(`App module '${modulePath}' not found`);
        }
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
            <Box ref={containerRef} id="app-container" /> {/* Container for the apps */}
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