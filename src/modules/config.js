const modulesConfig = {
  modules: [
    {
      name: "Health Session",
      description: "This module starts a health session.",
      path: "vitalSIA",
      settings: {
        apiKey: {
          name: "apiKey",
          type: "text",
          default: "fdasf",
          description: "API key for the chat application",
        },
        triggerPhrases: {
          name: "triggerPhrases",
          type: "text",
          default: "Hey GPT",
          description: "Trigger phrases to activate chat",
        },
      },
    },  ],
  
};

export default modulesConfig;