import React, { useState } from 'react';
import { Box, Textarea, Button, VStack } from '@chakra-ui/react';

const TextAreaUI = ({ onSubmit }) => {
    const [text, setText] = useState('');

    const handleSubmit = () => {
        onSubmit(text);
        setText('');
    };

    return (
        <Box p={4}>
            <VStack spacing={4}>
                <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text here..."
                    size="sm"
                />
                <Button onClick={handleSubmit} colorScheme="teal">
                    Submit
                </Button>
            </VStack>
        </Box>
    );
};

export default TextAreaUI;