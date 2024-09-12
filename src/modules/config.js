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
        name: 'Chat',
        path: 'chat',
        description: 'Chat module to handle user interactions',

    },
    {
      name: "Face Detection",
      description: "This app enables face detection using the webcam.",
      path: "faceDetectionApp",
    },
    // Add other apps as necessary
  ],
};

export default modulesConfig;