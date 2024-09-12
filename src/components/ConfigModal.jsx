import React from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input
} from '@chakra-ui/react';

const ConfigModal = ({
    isOpen,
    onClose,
    onSave,
    module,
    settings,
    handleInputChange,
    handleNumberInputChange
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{module.name} Module Configuration</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {Object.keys(settings).map((key) => (
                        <FormControl key={key} mb={4}>
                            <FormLabel>{key}</FormLabel>
                            {typeof settings[key] === 'number' ? (
                                <Input
                                    type="number"
                                    value={settings[key]}
                                    onChange={(e) => handleNumberInputChange(key, parseFloat(e.target.value))}
                                />
                            ) : (
                                <Input
                                    type="text"
                                    value={settings[key]}
                                    name={key}
                                    onChange={handleInputChange}
                                />
                            )}
                        </FormControl>
                    ))}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onSave}>
                        Save
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfigModal;