import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Button, IconButton, Text, Switch, Tooltip, Flex, Accordion, AccordionItem,
    AccordionButton, AccordionPanel, AccordionIcon, Alert, AlertIcon, useToast
} from '@chakra-ui/react';
import { InfoIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import modulesConfig from '../modules/config'; // Correct reference to modules
import ConfigModal from './ConfigModal';
import { ModulesProvider } from './ModulesContext';  // Ensure you import ModulesProvider

const ModulesMenu = ({ animationManager }) => {
    const [selectedModule, setSelectedModule] = useState(null);
    const [moduleSettings, setModuleSettings] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [error, setError] = useState(''); // State to handle errors
    const containerRef = useRef(null);
    const toast = useToast(); // Initialize the toast function

    // Load settings from localStorage or use default from config
    useEffect(() => {
        const initialSettings = {};
        modulesConfig.modules.forEach(module => {
            const storedSettings = localStorage.getItem(module.name);
            initialSettings[module.name] = storedSettings ? JSON.parse(storedSettings) : { ...module.settings };
        });
        setModuleSettings(initialSettings);
    }, []);

    // Save settings to localStorage
    const saveSettingsToLocalStorage = () => {
        Object.keys(moduleSettings).forEach(moduleName => {
            localStorage.setItem(moduleName, JSON.stringify(moduleSettings[moduleName]));
        });
    };

    const handleSwitchChange = (module, isChecked) => {
        import(`../modules/${module.path}`).then(moduleInstance => {
            if (isChecked) {
                if (!containerRef.current) {
                    console.error('Module container reference is invalid. Unable to start the module.');
                    setError('Module container reference is invalid. Unable to start the module.');
                    return;
                }
                setError(''); // Clear any previous error

                // Ensure the dynamic module is wrapped with `ModulesProvider`
                const ModuleComponent = () => (
                    <ModulesProvider>
                        <moduleInstance.start 
                            animationManager={animationManager} 
                            moduleSettings={moduleSettings[module.name]} 
                            containerRef={containerRef} 
                            toast={toast}
                        />
                    </ModulesProvider>
                );

                moduleInstance.start(animationManager, moduleSettings[module.name], containerRef, toast);
            } else {
                moduleInstance.stop(animationManager);
            }
        }).catch(err => {
            console.error(`Failed to load the module: ${module.name}`, err);
            setError(`Failed to load the module: ${module.name}`);
        });
    };

    const handleConfigClick = (module) => {
        if (moduleSettings[module.name]) {
            setSelectedModule(module);
            setIsModalOpen(true);
        } else {
            console.error("Settings not found for the selected module.");
            setError("Settings not found for the selected module.");
        }
    };

    // File Upload Logic
    const triggerFileUpload = (fileInput) => {
        fileInput.click();
    };

    const FileUploadComponent = ({ fileInputRef }) => {
        // Function to handle file selection and uploading logic
        const handleFileChange = async () => {
            const file = fileInputRef.current.files[0];
            if (!file) return; // Exit if no file is selected

            // Proceed with file handling (same as before)
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch('/upload-endpoint', {
                method: 'POST',
                body: formData,
            });

            if (uploadResponse.ok) {
                const fileData = await uploadResponse.json();
                console.log('File uploaded successfully:', fileData);

                // Optionally process the file on the server or pass the file URL/URI for further analysis
                const fileUri = fileData.uri;
                // Additional logic for processing the file after upload...
            } else {
                console.error('File upload failed');
            }
        };

        return (
            <input 
                type="file" 
                ref={fileInputRef} 
                accept=".csv"  // Adjust as needed
                style={{ display: 'none' }}  // Hide the file input
                onChange={handleFileChange}  // Handle file selection
            />
        );
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedModule(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setModuleSettings(prevSettings => ({
            ...prevSettings,
            [selectedModule.name]: {
                ...prevSettings[selectedModule.name],
                [name]: value,
            },
        }));
    };

    const handleNumberInputChange = (name, value) => {
        setModuleSettings(prevSettings => ({
            ...prevSettings,
            [selectedModule.name]: {
                ...prevSettings[selectedModule.name],
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

    // Create a ref for the file input
    const fileInputRef = useRef(null);

    return (
        <Box position="fixed" right="1rem" top="1rem" bg="white" p={4} borderRadius="md" boxShadow="lg">
            <Flex justify="space-between" align="center">
                <Text fontSize="xl" fontFamily="Arial, sans-serif" mb={4} mr={4}>Start Menu</Text>
                <IconButton
                    icon={isMenuOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    onClick={toggleMenu}
                    variant="outline"
                    size="sm"
                />
            </Flex>

            {/* Display error message */}
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            {/* Render File Upload Component */}
            <FileUploadComponent fileInputRef={fileInputRef} />

            {isMenuOpen && (
                <Accordion allowMultiple>
                    {modulesConfig.modules.map((module, index) => (
                        <AccordionItem key={index}>
                            <AccordionButton>
                                <Box flex="1" textAlign="left" fontFamily="Arial, sans-serif"> { module.name }</Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Flex align="center" justify="space-between" mb={2}>
                                    <Tooltip label={module.description} placement="top">
                                        <InfoIcon />
                                    </Tooltip>
                                    <Switch onChange={(e) => handleSwitchChange(module, e.target.checked)} />
                                    <Button size="sm" onClick={() => handleConfigClick(module)} fontFamily="Arial, sans-serif"> Config </Button>
                                </Flex>

                                <Flex align="center" justify="space-between" mb={2}>
                                    <Tooltip label={"Click to upload exercise data for analysis."} placement="top">
                                        <InfoIcon />
                                    </Tooltip>
                                    <Button 
                                        size="sm" 
                                        onClick={() => triggerFileUpload(fileInputRef.current)}  // Trigger file input click
                                        fontFamily="Arial, sans-serif"
                                    >
                                        Upload Data
                                    </Button>
                                </Flex>
                            </AccordionPanel>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}

            <Box ref={containerRef} id="module-container" /> {/* Container for the modules */}
            
            {selectedModule && (
                <ConfigModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSave={handleSaveConfig} // Save on button click
                    module={selectedModule}
                    settings={moduleSettings[selectedModule.name]}
                    handleInputChange={handleInputChange}
                    handleNumberInputChange={handleNumberInputChange}
                />
            )}
        </Box>
    );
};

export default ModulesMenu;
