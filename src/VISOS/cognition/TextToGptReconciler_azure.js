import { mode } from "d3";
import { AzureOpenAI } from "openai";
const { end_point, key } = require("./info.js");

process.env["AZURE_OPENAI_ENDPOINT"];
process.env["AZURE_OPENAI_API_KEY"];

let chatHistory = [];

export const initializeChat = () => {
  chatHistory = [];
};

export const processTextWithGPT = async (userInput) => {
  const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || end_point;
  const api_Key = process.env["AZURE_OPENAI_API_KEY"] || key;
  const apiVersion = "2024-05-01-preview";
  const model = "gpt-4"; 

  const client = new AzureOpenAI({
    endpoint,
    apiKey: api_Key,
    apiVersion,
    dangerouslyAllowBrowser: true,
  });

  // Push the initial user input to the chat history
  chatHistory.push({ role: 'user', content: userInput });

  try {
    // Use the completions.create endpoint for chat-based models
    const response = await client.chat.completions.create({
      model: model,
      messages: [
      { role: "system", content: "You are a compassionate and supportive personal health companion. Always respond with a friendly and warm tone, keeping your replies concise (no more than 5 sentences). After 3-5 conversations, gently asking about the person's emotional state, daily eating habits, and physical activities. If the person expresses negative feelings, offer thoughtful suggestions to uplift their mood. If they report low physical activity, provide encouraging advice to help them incorporate more exercise into their routine." },
      { role: "user", content: userInput },
      // { role: "assistant", content: "Yes, customer managed keys are supported by Azure OpenAI?" },
      // { role: "user", content: "Do other Azure AI services support this too?" },
      ],
    });

    const reply = response.choices[0].message.content;

    // Log and return the reply
    console.log(reply);

    // Add the assistant's reply to the chat history
    chatHistory.push({ role: 'assistant', content: reply });

    return reply;
  } catch (error) {
    console.error('Error processing response from backend service:', error);
    throw error;
  }
};
