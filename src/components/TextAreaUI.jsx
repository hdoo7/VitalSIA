import React, { useState, useEffect } from 'react';
import { Box, Button, Textarea, Switch, FormControl, FormLabel, Select } from '@chakra-ui/react';
import VoiceManager from '../VISOS/effectors/verbalizers/VoiceManager';

const TextAreaUI = ({ animationManager }) => {
    const [text, setText] = useState('If you were to insist I was a robot, you might not consider me capable of love in some mystic human sense.');
    const [voiceManager, setVoiceManager] = useState(null);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const [pitchEnhance, setPitchEnhance] = useState(false);

    useEffect(() => {
        if (animationManager && !voiceManager) {
            const vm = new VoiceManager(animationManager, pitchEnhance);
            setVoiceManager(vm);
            vm.onVoicesChanged = setVoices;
            setTimeout(() => {
                setVoices(vm.getVoices());
                setSelectedVoice(vm.voice ? vm.voice.name : '');
            }, 500); // Add a delay to ensure voices are loaded
        }
    }, [animationManager, pitchEnhance]);

    useEffect(() => {
        if (voiceManager) {
            voiceManager.setPitchEnhance(pitchEnhance);
        }
    }, [pitchEnhance, voiceManager]);

    const handleEnqueueText = () => {
        if (voiceManager) {
            voiceManager.enqueueText(text);
        }
    };

    const handleStopSpeech = () => {
        if (voiceManager) {
            voiceManager.stopSpeech();
        }
    };

    const handleInterruptSpeech = () => {
        if (voiceManager) {
            voiceManager.interruptSpeech("This is an interruption.");
        }
    };

    const handleVoiceChange = (e) => {
        const voiceName = e.target.value;
        setSelectedVoice(voiceName);
        if (voiceManager) {
            voiceManager.setVoice(voiceName);
        }
    };

    const handlePitchEnhanceChange = (e) => {
        const isChecked = e.target.checked;
        setPitchEnhance(isChecked);
        if (voiceManager) {
            voiceManager.setPitchEnhance(isChecked);
        }
    };

    return (
        <Box p={4}>
            <FormControl display="flex" alignItems="center" mb={4}>
                <FormLabel htmlFor="voice" mb="0">
                    Voice
                </FormLabel>
                <Select id="voice" value={selectedVoice} onChange={handleVoiceChange}>
                    {voices.map((voice, index) => (
                        <option key={index} value={voice.name}>
                            {voice.name}
                        </option>
                    ))}
                </Select>
            </FormControl>
            <FormControl display="flex" alignItems="center" mb={4}>
                <FormLabel htmlFor="pitch-enhance" mb="0">
                    Pitch Enhance Lip-Syncing
                </FormLabel>
                <Switch id="pitch-enhance" isChecked={pitchEnhance} onChange={handlePitchEnhanceChange} />
            </FormControl>
            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                mb={2}
                placeholder="Type your text here..."
            />
            <Button colorScheme="teal" onClick={handleEnqueueText} mb={2}>
                Enqueue Text
            </Button>
            <Button colorScheme="red" onClick={handleStopSpeech} mb={2}>
                Stop Speech
            </Button>
            <Button colorScheme="yellow" onClick={handleInterruptSpeech}>
                Interrupt Speech
            </Button>
        </Box>
    );
};

export default TextAreaUI;