const appsConfig = {
    apps: [
      {
        name: "Blink",
        description: "This app controls the blinking speed of the avatar.",
        path: "blink",
        settings: {
          speed: {
            name: "speed",
            type: "number",
            default: 2000,
            min: 500,  // Minimum value for speed
            max: 5000, // Maximum value for speed
            description: "Speed of blinking in milliseconds",
          },
        },
      },
      {
        name: "Close Eyes",
        description: "This app controls the blinking speed of the avatar.",
        path: "myApp"
      },
      {
        name: "Chat",
        description: "This app handles voice chat using GPT and voice synthesis.",
        path: "chat",
        settings: {
          apiKey: {
            name: "apiKey",
            type: "password",
            default: "",
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
    ],
  };
  
  export default appsConfig;