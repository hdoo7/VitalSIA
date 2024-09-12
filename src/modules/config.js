const modulesConfig = {
  modules: [
    {
      name: "Blink",
      description: "This app controls the blinking speed of the avatar.",
      path: "blink",
      settings: {
        speed: {
          name: "speed",
          type: "number",
          default: 2000,
          min: 500,
          max: 5000,
          description: "Speed of blinking in milliseconds",
        },
      },
    },
    {
      name: "Close Eyes",
      description: "This app controls the blinking speed of the avatar.",
      path: "myApp",
    },
    {
      name: "Chat",
      description: "This app handles voice chat using GPT and voice synthesis.",
      path: "chat",
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
    },
    {
      name: "Face Detection",
      description: "This app enables face detection using the webcam.",
      path: "faceDetectionApp",
    },
    {
      name: "French Vocabulary Quiz",  // Add the new quiz module here
      description: "A quiz that asks questions in French and expects answers in English.",
      path: "frenchVocabularyQuiz",  // The path to the module
    },
    // Add other apps as necessary
  ],
};

export default modulesConfig;