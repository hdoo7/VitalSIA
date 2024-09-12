import React, { useState, useEffect } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Button, Input, FormControl, FormLabel, NumberInput, NumberInputField, Switch, Select, Slider,
    SliderTrack, SliderFilledTrack, SliderThumb, Tooltip
} from '@chakra-ui/react';

const voices = ['Voice1', 'Voice2', 'Voice3', 'Voice4', 'Tessa']; // List of predefined voices

const ConfigModal = ({ isOpen, onClose, onSave, module, settings, handleInputChange}) => {
    const [localSettings, setLocalSettings] = useState({});

    useEffect(() => {
        if (settings) {
            setLocalSettings(settings);
        }
    }, [settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            [name]: value,
        }));
        handleInputChange(e);
    };

    const handleBooleanChange = (key, checked) => {
        setLocalSettings(prev => ({
            ...prev,
            [key]: checked,
        }));
    };

    const handleNumberInputChange = (name, value) => {
        setLocalSettings(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleArrayChange = (e, key) => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setLocalSettings(prev => ({
            ...prev,
            [key]: options,
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Configure {module.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {localSettings && Object.keys(localSettings).map((key) => {
                        const setting = localSettings[key];
                        
                        // If the setting object has a "type" field
                        switch (setting.type) {
                            case 'boolean':
                                return (
                                    <FormControl key={key} mb={4}>
                                        <FormLabel>{setting.name}</FormLabel>
                                        <Switch
                                            isChecked={setting.default}
                                            onChange={(e) => handleBooleanChange(key, e.target.checked)}
                                        />
                                    </FormControl>
                                );
                            case 'number':
                                return (
                                    <FormControl key={key} mb={4}>
                                        <FormLabel>{setting.name}</FormLabel>
                                        <Slider
                                            aria-label={setting.name}
                                            value={setting.default}
                                            min={setting.min}
                                            max={setting.max}
                                            step={100}
                                            onChange={(val) => handleNumberInputChange(key, val)}
                                        >
                                            <SliderTrack>
                                                <SliderFilledTrack />
                                            </SliderTrack>
                                            <Tooltip label={setting.default}>
                                                <SliderThumb />
                                            </Tooltip>
                                        </Slider>
                                    </FormControl>
                                );
                            case 'text':
                                return (
                                    <FormControl key={key} mb={4}>
                                        <FormLabel>{setting.name}</FormLabel>
                                        <Input
                                            name={key}
                                            value={setting.default}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                );
                            case 'voice':
                                return (
                                    <FormControl key={key} mb={4}>
                                        <FormLabel>Select Voice</FormLabel>
                                        <Select
                                            multiple
                                            placeholder="Select Voices"
                                            value={setting.default}
                                            onChange={(e) => handleArrayChange(e, key)}
                                        >
                                            {voices.map((voice, idx) => (
                                                <option key={idx} value={voice}>
                                                    {voice}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                );
                            default:
                                return null;
                        }
                    })}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => onSave(localSettings)}>
                        Save
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfigModal;