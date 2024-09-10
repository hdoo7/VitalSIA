class TextToGptReconciler {
    constructor(apiKey) {
      if (!apiKey || typeof apiKey !== 'string') {
        throw new Error('A valid OpenAI API key must be provided.');
      }
      this.apiKey = apiKey;
      this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    }
  
    /**
     * Processes the provided text by sending it to the OpenAI API.
     * @param {string} text - The input text to process.
     * @param {string} instruction - Instruction or system prompt for the AI.
     * @returns {Promise<string>} - The GPT response.
     */
    async processText(text, instruction = 'Answer in a professional manner:') {
      const payload = {
        model: 'gpt-3.5-turbo',  // You can switch this model based on your requirement
        messages: [
          { role: 'system', content: instruction },
          { role: 'user', content: text }
        ],
        max_tokens: 150,  // Adjust as necessary
        temperature: 0.7
      };
  
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
  
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
  
        const data = await response.json();
        const gptResponse = data.choices?.[0]?.message?.content?.trim();
  
        if (!gptResponse) {
          throw new Error('Failed to get a valid response from the API');
        }
  
        return gptResponse;
      } catch (error) {
        console.error('Error processing text with GPT:', error);
        throw error;
      }
    }
  }
  
  export default TextToGptReconciler;