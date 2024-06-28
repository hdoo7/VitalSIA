import React, { useState, useEffect } from 'react';
import { Box, Textarea, Button, VStack, HStack, Select } from '@chakra-ui/react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import VoiceManager from '../VISOS/effectors/verbalizers/VoiceManager';

const TextAreaUI = ({ animationManager }) => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');
  const [voiceManager, setVoiceManager] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');

  useEffect(() => {
    if (!animationManager) return;
    const vm = new VoiceManager(animationManager);
    vm.onVoicesChanged = (availableVoices) => {
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
        vm.setVoice(availableVoices[0].name);
      }
    };
    setVoiceManager(vm);
    setText("If you were to insist I was a robot, you might not consider me capable of love... in some mystic human sense.");
    // Set a timeout to repopulate voices if they are not available immediately
    setTimeout(() => {
      if (voices.length === 0) {
        const availableVoices = vm.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0].name);
          vm.setVoice(availableVoices[0].name);
        }
      }
    }, 1000);
  }, [animationManager, voices.length]);

  const handleTextSubmit = () => {
    if (voiceManager) {
      voiceManager.enqueueText(text);
    }
  };

  const handleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Start speech recognition
    } else {
      // Stop speech recognition
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

  const handleVoiceDropdownClick = () => {
    if (voices.length === 0) {
      const availableVoices = voiceManager.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
        voiceManager.setVoice(availableVoices[0].name);
      }
    }
  };

  return (
    <VStack spacing={4} w="100%">
      <Select
        placeholder="Select Voice"
        value={selectedVoice}
        onChange={handleVoiceChange}
        onClick={handleVoiceDropdownClick}
      >
        {voices.map((voice, index) => (
          <option key={index} value={voice.name}>
            {voice.name}
          </option>
        ))}
      </Select>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your text here..."
        size="sm"
      />
      <HStack spacing={4} w="100%">
        <Button onClick={handleTextSubmit} colorScheme="teal">
          Submit
        </Button>
        <Button onClick={handleListening} colorScheme={isListening ? 'red' : 'blue'}>
          {isListening ? <FaStop /> : <FaMicrophone />}
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </Button>
        <Button colorScheme="red" onClick={handleStopSpeech}>
          Stop Speech
        </Button>
        <Button colorScheme="yellow" onClick={handleInterruptSpeech}>
          Interrupt Speech
        </Button>
      </HStack>
    </VStack>
  );
};

export default TextAreaUI;