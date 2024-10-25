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
    return processTextWithGPT(text, instruction, this.apiKey, this.apiUrl);
  }
}

/**
 * Functional version of processing text with GPT without needing to instantiate the class.
 * @param {string} text - The input text to process.
 * @param {string} instruction - Instruction or system prompt for the AI.
 * @param {string} apiKey - The OpenAI API key.
 * @param {string} apiUrl - The OpenAI API URL.
 * @returns {Promise<string>} - The GPT response.
 */
// TextToGptReconciler.js
export const processTextWithGPT = async (apiKey, text) => {
  try {
    console.log(apiKey)
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [
                  { role: 'system', content: 'Answer the question in a helpful manner.' },
                  { role: 'user', content: text },
              ],
              max_tokens: 100,
          }),
      });

      const data = await response.json();
      if (!response.ok || !data.choices) {
          throw new Error(`GPT API error: ${response.status}`);
      }

      return data.choices[0].message.content;
  } catch (error) {
      console.error('Error processing GPT response:', error);
      throw error;
  }
};