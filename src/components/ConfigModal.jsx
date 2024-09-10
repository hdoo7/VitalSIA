// ConfigModal.jsx (or where the modal config is being handled)
import { useState, useEffect } from 'react';
import { Button, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';

const ConfigModal = ({ isOpen, onClose, app, settings, handleInputChange }) => {
    const [localSettings, setLocalSettings] = useState(settings);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSave = () => {
        Object.keys(localSettings).forEach(key => {
            handleInputChange({ target: { name: key, value: localSettings[key] } });
        });
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalSettings(prevSettings => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Configure {app.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input
                        name="apiKey"
                        placeholder="API Key"
                        value={localSettings.apiKey || ''}
                        onChange={handleChange}
                        mb={3}
                    />
                    <Input
                        name="triggerPhrases"
                        placeholder="Trigger Phrases"
                        value={localSettings.triggerPhrases || ''}
                        onChange={handleChange}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="ghost" ml={3} onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfigModal;