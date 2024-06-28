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
    setVoiceManager(vm);
    const availableVoices = vm.getVoices();
    setVoices(availableVoices);
    if (availableVoices.length > 0) {
      setSelectedVoice(availableVoices[0].name);
      vm.setVoice(availableVoices[0].name);
    }
  }, [animationManager]);

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

  return (
    <VStack spacing={4} w="100%">
      <Select placeholder="Select Voice" value={selectedVoice} onChange={handleVoiceChange}>
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