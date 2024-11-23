import { GoogleGenerativeAI } from "@google/generative-ai";
import { start as startEmpathy, stop as stopEmpathy } from './empathy.js'; 


// Initialize the chat history
let chatHistory = [];

/**
 * Initializes the chat history.
 * Resets the conversation history to start fresh.
 */
export const initializeChat = () => {
  // Reset the chat history
  chatHistory = [];
};

/**
 * Processes user input by sending it to your backend service.
 * @param {string} apiKey - The OpenAI API key (not used in this implementation but kept to match the method signature).
 * @param {string} userInput - The user's response.
 * @returns {Promise<string>} - The assistant's response.
 */


export const processTextWithGPT = async (apiKey, userInput) => {
  const negativeWords = [
    "sad", "tired", "depressed", "unhappy", "down", "miserable", "hopeless", 
    "angry", "stressed", "anxious", "lonely", "isolated", "empty", "heartbroken",
    "frustrated", "lost", "helpless", "worthless", "burdened", "guilty", "grief",
    "despair", "hopeless", "overwhelmed", "defeated", "bored", "disappointed", 
    "painful", "shattered", "sick", "trapped", "rejected", "hurt", "crushed"
  ];
  const userInputLower = userInput.toLowerCase();
  for (let word of negativeWords) {
    if (userInputLower.includes(word)) {
        startEmpathy(window.animationManager, {});
        break; 
    }
  }

  // Add user input to chat history
  chatHistory.push({ role: 'user', content: userInput });

  const api_Key = "AIzaSyCrxYLaaSUbuGGve2dL5MvZ00KlYIMBQsc";
  const genAI = new GoogleGenerativeAI(api_Key);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    systemInstruction: "You are a helpful, caring, and friendly personal health management companion. Keep the response no more than 3 sentences. "
});



  try {
    // Send the POST request to your backend service
    const response = await model.generateContent(userInput);
    console.log(response.response.text());

    // Add the assistant's response to chat history
    chatHistory.push({ role: 'assistant', content: response.response.text()});
    stopEmpathy(window.animationManager, {});

    return response.response.text();
  } catch (error) {
    console.error('Error processing response from backend service:', error);
    throw error;
  }
};
