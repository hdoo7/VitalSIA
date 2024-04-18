import React, { useState } from 'react';
import { Flex, Icon, Text, Tooltip, useToast } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const Survey = ({ questions, onSurveyComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [hoverIndex, setHoverIndex] = useState(-1); // Initialize hoverIndex to -1
  const toast = useToast();

  const handleResponse = (rating) => {
    const newResponses = { ...responses, [questions[currentQuestionIndex].id]: rating };
    setResponses(newResponses);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
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

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <Tooltip label={`${index + 1} Stars`} key={index} hasArrow placement="top">
        <Icon
          as={StarIcon}
          boxSize={10}
          m={1}
          color={(hoverIndex >= 0 ? index <= hoverIndex : index < (responses[currentQuestion.id] || 0)) ? "orange.400" : "gray.300"}
          onClick={() => handleResponse(index + 1)}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(-1)}
          _hover={{ color: "orange.600", cursor: "pointer", transform: "scale(1.1)" }}
          transition="transform 0.2s ease-in-out"
        />
      </Tooltip>
    ));
  };

  return (
    <Flex justifyContent="center" alignItems="center" position="fixed" bottom="0" w="full" p={4} bgColor="gray.100">
      <Text fontSize="xl" fontFamily="Avenir" fontWeight="bold" mr={4}>{currentQuestion.text}</Text>
      {renderStars()}
    </Flex>
  );
};

export default Survey;
