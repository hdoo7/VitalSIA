// src/components/ConfigModal.jsx
import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';

const ConfigModal = ({ isOpen, onClose, app, settings, handleSettingsChange }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Configure {app?.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {app && Object.keys(app.settings).map(setting => (
                        <FormControl key={setting}>
                            <FormLabel>{setting}</FormLabel>
                            <Input
                                type="number"
                                name={setting}
                                value={settings[setting]}
                                onChange={handleSettingsChange}
                            />
                        </FormControl>
                    ))}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfigModal;