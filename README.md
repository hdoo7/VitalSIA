
# EVA-libre

## Table of Contents
1. [Installation](#installation)
   - [Windows](#windows)
   - [macOS](#macos)
   - [Linux](#linux)
2. [Running the Server](#running-the-server)
3. [Deploying to GitHub Pages](#deploying-to-github-pages)
4. [Animation Manager](#animation-manager)
5. [Setting up an App](#setting-up-an-app)
6. [Voice Manager and Speech Manager](#voice-manager-and-speech-manager)
7. [Speech Processor](#speech-processor)

## Installation

To install the system on your local machine, follow these steps based on your operating system.

### Windows

1. Install Git and Node.js using Chocolatey (https://chocolatey.org/):
   ```bash
   choco install git nodejs
   ```

2. Install Yarn using npm:
   ```bash
   npm install -g yarn
   ```

3. Fork the repository on GitHub and then clone your forked repository:
   ```bash
   git clone https://github.com/<your-username>/EVA-libre.git
   ```

4. Navigate to the project directory:
   ```bash
   cd EVA-libre
   ```

5. Install dependencies:
   ```bash
   yarn install
   ```

### macOS

1. Install Git and Node.js using Homebrew:
   ```bash
   brew install git node
   ```

2. Install Yarn using npm:
   ```bash
   npm install -g yarn
   ```

3. Fork the repository on GitHub and then clone your forked repository:
   ```bash
   git clone https://github.com/<your-username>/EVA-libre.git
   ```

4. Navigate to the project directory:
   ```bash
   cd EVA-libre
   ```

5. Install dependencies:
   ```bash
   yarn install
   ```

### Linux

1. Install Git, Node.js, and npm using your package manager (e.g., apt for Debian/Ubuntu):
   ```bash
   sudo apt update && sudo apt install git nodejs npm
   ```

2. Install Yarn using npm:
   ```bash
   npm install -g yarn
   ```

3. Fork the repository on GitHub and then clone your forked repository:
   ```bash
   git clone https://github.com/<your-username>/EVA-libre.git
   ```

4. Navigate to the project directory:
   ```bash
   cd EVA-libre
   ```

5. Install dependencies:
   ```bash
   yarn install
   ```

## Running the Server

1. Start the development server:
   ```bash
   yarn start
   ```

2. The server will be available at `http://localhost:3000`.

## Deploying to GitHub Pages

### 1. Enable GitHub Pages in the repository settings:

- Go to your repository on GitHub.
- Navigate to the **Settings** tab.
- In the sidebar, click on **Pages**.
- Under **Source**, select the branch `gh-pages` and choose the `/root` directory (or `/docs` if relevant to your setup).
- Click **Save**.

Once this is done, your project will be accessible at:
https://<YourGitHubUserName>.github.io/EVA-libre
:
1. Build the project:
   ```bash
   yarn build
   ```

2. Deploy the build to GitHub Pages:
   ```bash
   yarn deploy
   ```

This will automatically deploy the site to the `gh-pages` branch of your repository, making it available at `https://<your-username>.github.io/EVA-libre`.

## Animation Manager

The Animation Manager is responsible for controlling the visual animations of characters. To use the Animation Manager, import it into your project and create an instance of it.

Example:
```javascript
import AnimationManager from './src/VISOS/effectors/visualizers/AnimationManager';

const animationManager = new AnimationManager();
// Use animationManager to control animations
```

## Setting up a Module


# Adding a New Module in EVA-Libre

## 1. Update `src/apps/config.js`

```javascript
{
  name: "Close Eyes",
  description: "This app controls the avatar's eye movements.",
  path: "myApp" // The path where the app logic resides
}
```

To add a new app, for example a **"Blink"** app:

```javascript
{
  name: "Blink",
  description: "This app controls the blinking speed of the avatar.",
  path: "blinkApp", // Path to your new module file
  settings: {
    speed: {
      name: "speed",
      type: "number",
      default: 2000,
      min: 500,
      max: 5000,
      description: "Speed of blinking in milliseconds"
    }
  }
}
```

## 2. Create the App Module File

For **Close Eyes**, the file is `src/apps/myApp.js`. Here is the content:

```javascript
// Declare a variable to hold the interval ID for the blinking action
let blinkInterval;

/**
 * Starts the blinking action using the provided animation manager and settings.
 *
 * @param {Object} animationManager - The manager responsible for controlling facial animations.
 * @param {Object} settings - The configuration settings for the blink action, such as speed.
 */
export function start(animationManager, settings)   {
    animationManager.scheduleChange("45", 200, 100, 0); 
}

/**
 * Stops the blinking action by clearing the interval.
 *
 * @param {Object} animationManager - The manager responsible for controlling facial animations.
 */
export function stop(animationManager) {
    // If the blinking interval is active, clear it to stop the blinking action
    animationManager.scheduleChange("45", 0, 100, 0); 
}
```

For a new **"Blink"** app, create `src/apps/blinkApp.js` with similar structure:

```javascript
// Declare a variable to hold the interval ID for the blinking action
let blinkInterval;

/**
 * Starts the blinking action using the provided animation manager and settings.
 *
 * @param {Object} animationManager - The manager responsible for controlling facial animations.
 * @param {Object} settings - The configuration settings for the blink action, such as speed.
 */
export function start(animationManager, settings) {
    blinkInterval = setInterval(() => {
        animationManager.scheduleChange("45", 200, 100, 0); // Schedule the blink action
    }, settings.speed);
}

/**
 * Stops the blinking action by clearing the interval.
 *
 * @param {Object} animationManager - The manager responsible for controlling facial animations.
 */
export function stop(animationManager) {
    clearInterval(blinkInterval); // Clear the blink interval
    animationManager.scheduleChange("45", 0, 100, 0); // Set the eyes to open
}
```

## 3. Test the New App

1. Run the app:
   ```bash
   yarn start
   ```

2. Check the UI for the new "Blink" app.


## Voice Manager and Speech Manager

### Voice Manager
The Voice Manager handles the configuration and management of different voices within the system. It integrates with various text-to-speech (TTS) engines to provide natural and dynamic voice outputs.

### Speech Manager (MS TTS)
The Speech Manager is specifically designed to work with Microsoft Text-to-Speech (TTS) services. It handles the conversion of text to speech using MS TTS, providing an interface for easy integration into applications.

Example setup and usage:
```javascript
import VoiceManager from './src/VISOS/effectors/verbalizers/VoiceManager';
import SpeechManager from './src/VISOS/effectors/verbalizers/SpeechManager';

// Initialize Voice and Speech Managers
const voiceManager = new VoiceManager();
const speechManager = new SpeechManager(voiceManager);

// Use speechManager to convert text to speech
speechManager.speak("Hello, this is a test using MS TTS.");
```

# Speech Processor

The **SpeechProcessor** class provides an easy-to-use API for detecting trigger phrases using speech recognition. It relies on the **Web Speech API** to continuously listen for spoken phrases, and it can trigger custom events when specific phrases are detected.

## Features
- **Trigger Phrase Detection**: Continuously listens for and detects predefined trigger phrases.
- **Continuous Speech Recognition**: Automatically restarts if recognition stops unexpectedly.
- **Custom Event Handling**: Executes a callback when a trigger phrase is detected.
- **Error Handling and Recovery**: Automatically handles common speech recognition errors and attempts to restart.

## Constructor

```javascript
constructor(triggerPhrases, onTriggerDetected)
```

- `triggerPhrases`: An array or a single string containing the phrases you want to detect. This will be converted into a regex for matching the speech results.
- `onTriggerDetected`: A callback function that is executed when one of the trigger phrases is detected in the recognized speech.

## Methods

### `initializeRecognition()`

Initializes the speech recognition functionality, checks for browser support, and sets up event handlers for speech recognition results, errors, and when recognition ends.

### `prepareTriggerPhrasesRegex(phrases)`

Converts the provided trigger phrases into a regular expression for more flexible matching. This ensures phrases can be detected even with slight variations in spacing.

### `start()`

Starts the speech recognition process. This method ensures that recognition is not started multiple times simultaneously.

### `handleResult(event)`

Handles speech recognition results. It listens for final speech results and checks if the recognized text matches any of the trigger phrases. If a match is found, it executes the `onTriggerDetected` callback.

### `handleEnd()`

Handles the end of the speech recognition session and attempts to restart recognition automatically to keep it running continuously.

### `handleError(event)`

Handles errors that occur during speech recognition, such as `no-speech` or `audio-capture` errors, and attempts to restart the recognition process after handling the error.

### `restartRecognition()`

Restarts the speech recognition process after a short delay to avoid potential infinite loops or browser throttling.

## Example Usage

```javascript
import SpeechProcessor from './SpeechProcessor';

// Define trigger phrases and a callback function
const triggerPhrases = ['hello world', 'start process', 'stop listening'];
const onTriggerDetected = (phrase) => {
  console.log(`Trigger detected: ${phrase}`);
  // Add any additional functionality here
};

// Initialize the SpeechProcessor
const speechProcessor = new SpeechProcessor(triggerPhrases, onTriggerDetected);

// Start listening for speech
speechProcessor.start();
```

## Browser Compatibility

This feature relies on the **Web Speech API**, which is supported in the following browsers:
- Google Chrome (desktop and Android)
- Microsoft Edge
- Firefox (limited support)
- Safari (macOS)

## Error Handling and Automatic Recovery

The **SpeechProcessor** class includes error handling and automatic recovery for common issues such as:
- `no-speech`: No speech detected during recognition.
- `audio-capture`: Issues with microphone access.

In these cases, the recognition will automatically restart after a short delay.

## Customization

You can easily modify the recognition language or other parameters by adjusting the properties in the `initializeRecognition()` method. For example, to switch the recognition language:

```javascript
this.recognition.lang = 'es-ES'; // Switch to Spanish
```
