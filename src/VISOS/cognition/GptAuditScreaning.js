class GptAuditScreening {
    constructor(apiKey, questions) {
        if (!apiKey || typeof apiKey !== 'string') {
            throw new Error('A valid OpenAI API key must be provided.');
        }
        this.apiKey = apiKey;
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
        this.auditHistory = [];  // To store the conversation history
        this.currentQuestionIndex = 0;  // Track the current question index
        this.responses = [];  // Store responses for scoring
        this.questions = questions;  // Load questions from external file
        this.screeningStopped = false;  // Flag to stop screening early if needed
        this.initializeScreening();  // Set up the initial system prompt
    }

    /**
     * Sets up the session environment with a controlled prompt.
     */
    initializeHealthCompanion() {
        this.dailyHealthLog = [
            {
                role: 'system',
                content: "You are a professional health management companion designed to assist users with their daily health routines. Maintain a friendly, supportive demeanor, and provide personalized guidance based on the user's health goals and current status. Offer reminders for medication, exercise, and healthy habits. Encourage progress and provide motivational support when needed."
            },
        ];
    }

    /**
     * Processes the user's response to the current health assessment question.
     * @param {string} userResponse - The user's response to the question.
     * @returns {Promise<object>} - Contains the next question or results if the screening is complete.
     */
    async processResponse(userResponse) {
        // Store the user's response
        const currentQuestion = this.questions[this.currentQuestionIndex];
        this.responses.push({ question: currentQuestion.text, response: userResponse });

        // Check if the screening should stop based on early responses
        if (this.shouldStopScreening()) {
            this.screeningStopped = true;
            return { type: 'results', results: { message: "Session ended based on your responses. Thank you for your time." }};
        }

        // Move to the next question
        this.currentQuestionIndex++;

        // If the screening is complete, calculate results and return
        if (this.isComplete()) {
            const results = this.getResults();
            return { type: 'results', results };
        }

        // Otherwise, get the next question
        const nextQuestion = this.getCurrentQuestion();
        this.auditHistory.push({ role: 'user', content: userResponse });

        return await this.sendNextQuestion(nextQuestion);
    }

    /**
     * Logic to determine if the session should stop based on responses.
     */
    shouldStopScreening() {
        const firstResponse = this.responses[0]?.response?.toLowerCase();
        if (firstResponse === 'never') {
            // Stop screening if user has no drinking history (customizable logic)
            return true;
        }
        return false;
    }

    /**
     * Checks if all assessment questions have been asked.
     * @returns {boolean} - True if the screening is complete, otherwise false.
     */
    isComplete() {
        return this.currentQuestionIndex >= this.questions.length || this.screeningStopped;
    }

    // Additional methods for sending the next question, calculating results, etc.
    // ...
}