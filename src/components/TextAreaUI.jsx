import React, { useState, useEffect } from 'react';
import { Box, Button, Textarea, Switch, FormControl, FormLabel, Select } from '@chakra-ui/react';
import VoiceManager from '../VISOS/action/verbalizers/VoiceManager';

const TextAreaUI = ({ animationManager }) => {
    const [text, setText] = useState('If you were to insist I was a robot, you might not consider me capable of love in some mystic human sense.');
    const [voiceManager, setVoiceManager] = useState(null);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const [pitchEnhance, setPitchEnhance] = useState(false);
    const [showAllVoices, setShowAllVoices] = useState(false); // State to toggle between showing all voices or the best four
    const [topVoices, setTopVoices] = useState([]); // State for the top voices

    useEffect(() => {
        if (animationManager && !voiceManager) {
            const vm = new VoiceManager(animationManager, pitchEnhance);
            setVoiceManager(vm);
            vm.onVoicesChanged = setVoices;

            setTimeout(() => {
                const availableVoices = vm.getVoices();
                const bestVoices = availableVoices.filter(voice =>
                    (voice.name.includes('Google') && (voice.lang === 'en-US' || voice.lang === 'en-GB' || voice.lang === 'en-US' || voice.lang === 'fr-FR'))
                    || voice.name.includes('Samantha')
                ).slice(0, 5); // Select the top 4 voices
                setVoices(availableVoices);
                setTopVoices(bestVoices);
                setSelectedVoice(bestVoices[0]?.name || '');
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

    const handleVoiceSwitchChange = (e) => {
        setShowAllVoices(e.target.checked);
    };

    return (
        <Box p={4}>
            <FormControl display="flex" alignItems="center" mb={4}>
                <FormLabel htmlFor="voice" mb="0">
                    Voice
                </FormLabel>
                <Select id="voice" value={selectedVoice} onChange={handleVoiceChange}>
                    {(showAllVoices ? voices : topVoices).map((voice, index) => (
                        <option key={index} value={voice.name}>
                            {voice.name} ({voice.lang})
                        </option>
                    ))}
                </Select>
            </FormControl>

            <FormControl display="flex" alignItems="center" mb={4}>
                <FormLabel htmlFor="show-all-voices" mb="0">
                    Show All Voices
                </FormLabel>
                <Switch id="show-all-voices" isChecked={showAllVoices} onChange={handleVoiceSwitchChange} />
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