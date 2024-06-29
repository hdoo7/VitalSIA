// src/apps/config.js
const appsConfig = {
    apps: [
        {
            name: "Blink",
            description: "Blinks the eyes at a regular interval.",
            path: "blink.js",
            settings: {
                speed: {
                    type: "number",
                    default: 3000,
                    min: 1000,
                    max: 10000
                }
            }
        }
    ]
};

export default appsConfig;