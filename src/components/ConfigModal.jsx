import React from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
    FormControl, FormLabel, Input, ModalFooter, NumberInput, NumberInputField,
    NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Button
} from '@chakra-ui/react';
console.log()
const ConfigModal = ({ isOpen, onClose, app, settings, handleSettingsChange, handleNumberInputChange }) => {

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{app?.name} Settings</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {Object.keys(app?.settings || {}).map((setting, index) => (
                        <FormControl key={index} mb={4}>
                            <FormLabel>{app.settings[setting]?.description}</FormLabel>
                            {app.settings[setting]?.type === 'number' ? (
                                <NumberInput
                                    name={app.settings[setting].name}
                                    value={settings[app.settings[setting].name].default}
                                    onChange={(valueString, valueNumber) => handleNumberInputChange(app.settings[setting].name, valueNumber)}
                                    min={app.settings[setting].min || 0}  // Set the minimum value (default to 0 if undefined)
                                    max={app.settings[setting].max || 10000}  // Set the maximum value (default to 10000 if undefined)
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            ) : (
                                <Input
                                    type={app.settings[setting].type}
                                    name={app.settings[setting].name}
                                    value={settings[app.settings[setting].name]}
                                    onChange={handleSettingsChange}
                                />
                            )}
                        </FormControl>
                    ))}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfigModal;