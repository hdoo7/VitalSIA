class TextToGptReconciler {
  constructor(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('A valid OpenAI API key must be provided.');
    }
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    this.chatHistory = [];  // Initialize chat history
  }

  /**
   * Sets up Susan's personality and initial system prompt.
   */
  initializeChat() {
    this.chatHistory = [
      {
        role: 'system',
        content: "You are a professional health management companion designed to assist users with their daily health routines. Maintain a friendly, supportive demeanor, and provide personalized guidance based on the user's health goals and current status. Offer reminders for medication, exercise, and healthy habits. Encourage progress and provide motivational support when needed."
      }
    ];
  }

  /**
   * Processes the provided text by sending it to the OpenAI API, including the chat history.
   * @param {string} text - The input text to process.
   * @returns {Promise<string>} - The GPT response.
   */
  async processText(text) {
    // Add user message to chat history
    this.chatHistory.push({ role: 'user', content: text });

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: this.chatHistory,
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.choices) {
        throw new Error(`GPT API error: ${response.status}`);
      }

      // Extract the assistant's response and add it to chat history
      const assistantMessage = data.choices[0].message.content;
      this.chatHistory.push({ role: 'assistant', content: assistantMessage });

      return assistantMessage;
    } catch (error) {
      console.error('Error processing GPT response:', error);
      throw error;
    }
  }
}

// Functional version of processing text with GPT, including Susan's personality
export const processTextWithGPT = async (apiKey, text, chatHistory = []) => {
  chatHistory.push({ role: 'user', content: text });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: "You are a professional health management companion designed to assist users with their daily health routines. Maintain a friendly, supportive demeanor, and provide personalized guidance based on the user's health goals and current status. Offer reminders for medication, exercise, and healthy habits. Encourage progress and provide motivational support when needed." },
          ...chatHistory
        ],
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.choices) {
      throw new Error(`GPT API error: ${response.status}`);
    }

    const assistantMessage = data.choices[0].message.content;
    chatHistory.push({ role: 'assistant', content: assistantMessage });

    return assistantMessage;
  } catch (error) {
    console.error('Error processing GPT response:', error);
    throw error;
  }
};

export default TextToGptReconciler;