import { useState, useCallback } from 'react';
import GptAuditScreening from './../cognition/GptAuditScreening';

const useAuditFlow = (apiKey) => {
    const [auditScreening] = useState(() => new GptAuditScreening(apiKey));
    const [currentQuestion, setCurrentQuestion] = useState(auditScreening.getCurrentQuestion());
    const [responses, setResponses] = useState([]);
    const [isComplete, setIsComplete] = useState(false);

    // Records a response and moves to the next question or completes the questionnaire
    const recordResponse = useCallback((userResponse) => {
        auditScreening.recordResponse(userResponse);  // Record response in GptAuditScreening

        // Update responses state
        setResponses((prevResponses) => [
            ...prevResponses,
            { question: currentQuestion.text, response: userResponse },
        ]);

        // Check if the questionnaire is complete
        if (auditScreening.isComplete()) {
            setIsComplete(true);
        } else {
            // Move to the next question
            setCurrentQuestion(auditScreening.getCurrentQuestion());
        }
    }, [auditScreening, currentQuestion]);

    const getResults = useCallback(() => {
        return auditScreening.getResults();
    }, [auditScreening]);

    return {
        currentQuestion,
        responses,
        isComplete,
        recordResponse,
        getResults,
    };
};

export default useAuditFlow;