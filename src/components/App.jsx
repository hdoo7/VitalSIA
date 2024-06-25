import React, { useState } from 'react';
import VoiceManager from './VISOS/effectors/verbalizers/VoiceManager';
import { Box, Button, Input, Textarea } from '@chakra-ui/react';

const App = () => {
    const [text, setText] = useState('');
    const [voiceManager, setVoiceManager] = useState(null);

    // Initialize VoiceManager on component mount
    React.useEffect(() => {
        const animationManager = {
            facsLib: {
                setTargetViseme: (viseme, weight, duration) => {
                    console.log(`Setting viseme ${viseme} with weight ${weight} and duration ${duration}`);
                },
                updateEngine: () => {
                    console.log('Engine updated');
                },
            },
        };
        const vm = new VoiceManager(animationManager);
        setVoiceManager(vm);
    }, []);

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

    return (
        <Box p={4}>
            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to synthesize"
                mb={2}
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

export default App;

