import React, { useState } from 'react';
import { Box, Button, Flex, Icon, Text, Tooltip, useToast } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const Survey = ({ questions, onSurveyComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const toast = useToast();

  // Handles user response for each question
  const handleResponse = (rating) => {
    const newResponses = { ...responses, [questions[currentQuestionIndex].id]: rating };
    setResponses(newResponses);

    if (currentQuestionIndex < questions.length - 1) {
      // Move to the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // End of survey, call the completion handler
      onSurveyComplete(newResponses);
      toast({
        title: "Survey Completed",
        description: "Thank you for your responses!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Flex justifyContent="center" alignItems="center" position="fixed" bottom="0" w="100%" p={4} bgColor="gray.100">
      <Text fontSize="lg" mr={4}>{currentQuestion.text}</Text>
      {currentQuestion.options.map((option, index) => (
        <Tooltip label={option} key={index} hasArrow placement="top">
          <Icon
            as={StarIcon}
            boxSize={8}
            m={1}
            color={index < (responses[currentQuestion.id] || 0) ? "yellow.400" : "gray.300"}
            onClick={() => handleResponse(index + 1)}
            _hover={{ color: "yellow.600", cursor: "pointer", transform: "scale(1.2)" }}
            transition="transform 0.2s ease-in-out"
          />
        </Tooltip>
      ))}
    </Flex>
  );
};

export default Survey;
