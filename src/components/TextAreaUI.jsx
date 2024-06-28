import React, { useState, useEffect } from 'react';
import { Box, Textarea, Button, VStack, HStack } from '@chakra-ui/react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import VoiceManager from '../VISOS/effectors/verbalizers/VoiceManager';

const TextAreaUI = (manager) => {
  
  
  const [isListening, setIsListening] = useState(false);
  const [voiceManager, setVoiceManager] = useState(null);

  const handleTextSubmit = () => {
    if (!manager) return;

    const vmm = new VoiceManager(manager);
      vmm.enqueueText(text);
    
    
  };
    const [text, setText] = useState('');
  useEffect(() => {  
    if (!manager) return;
    const vm = new VoiceManager(manager);
    setVoiceManager(vm);

  }, [manager]);
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

  return (
    <VStack spacing={4} w="100%">
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