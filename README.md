# EVA-libre

## Table of Contents
1. [Installation](#installation)
   - [Windows](#windows)
   - [macOS](#macos)
   - [Linux](#linux)
2. [Running the Server](#running-the-server)
3. [Deploying to GitHub Pages](#deploying-to-github-pages)
4. [Animation Manager](#animation-manager)
5. [Creating Your Own Module](#creating-your-own-module)
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
---

### **Basic Usage**

At its core, the `AnimationManager` allows you to control the avatar's facial expressions using action units (AUs). Each facial action is defined by an AU number, intensity (how strong the action is), duration (how long it lasts), and delay (when it starts).

```javascript
// Example 1: Trigger a simple smile
export function smile(animationManager) {
    animationManager.scheduleChange("12", 88, 250, 0); // AU 12 (lip corner puller) with intensity 88, for 250ms, no delay
}
```

In this example, AU12 is used to pull the lips upwards to create a smile. The `scheduleChange` method takes 4 parameters:
- The AU code ("12" for smile)
- The intensity of the action (range 0-100, where 100 is full intensity)
- The duration in milliseconds (how long the action will last)
- The delay before starting (how long to wait before triggering the action)

---

### **Advanced Usage with Promises**

When managing multiple animations or needing precise control over animation sequences, it's helpful to use promises. The `AnimationManager` can return promises that resolve when all scheduled animations are complete, allowing for more complex and timed actions.

```javascript
// Example 2: Trigger a smile, wait for it to finish, then frown
export function smileThenFrown(animationManager) {
    smile(animationManager).then(() => {
        frown(animationManager);
    });
}

export function frown(animationManager) {
    animationManager.scheduleChange("12", 0, 500, 250); // AU12 with 0 intensity (return to neutral) over 500ms, delayed by 250ms
}
```

In this example, the smile happens first, and then the frown starts after the smile animation completes. You can chain animations this way to create more complex facial behavior.

---

### **Looping Animations**

Looping is useful when you want continuous facial expressions or behaviors, such as blinking or alternating expressions.

```javascript
// Example 3: Loop smile and frown animations continuously
export function loopSmileAndFrown(animationManager) {
    setInterval(() => {
        smile(animationManager);
        setTimeout(() => frown(animationManager), 1000); // Wait 1 second before frowning
    }, 2000); // Loop every 2 seconds
}
```

This example triggers a smile, waits for 1 second, then frowns, and repeats the loop every 2 seconds.

---

### **Advanced Example: Combining Multiple Action Units**

In this example, we'll combine several AUs to simulate a more complex facial movement, such as sticking the tongue out.

```javascript
// Example 4: Stick tongue out and bulge it
export function stickTongueOut(animationManager) {
    animationManager.scheduleChange("36", 180, 250, 0); // AU36 (tongue show) at full intensity
    animationManager.scheduleChange("19", 180, 250, 250); // AU19 (tongue bulge) starting after 250ms
}

export function pullTongueIn(animationManager) {
    animationManager.scheduleChange("36", 0, 250, 0); // Retract tongue (AU36 back to 0 intensity)
    animationManager.scheduleChange("19", 0, 250, 250); // Retract bulge (AU19 back to 0 intensity)
}
```

In this scenario, the tongue is first shown and then bulged out. Afterward, the tongue is pulled back in using the same AUs with 0 intensity.

---

### **Randomized Animations: Blinking**

Blinking is an important aspect of making the avatar appear lifelike. Below is an example where we create random blinking intervals.

```javascript
// Example 5: Trigger a blink with randomness
export function triggerBlink(animationManager) {
    animationManager.scheduleChange("45", 100, 500, 0); // AU45 (blink) with 100 intensity for 500ms
    animationManager.scheduleChange("45", 0, 500, 500); // Reset blink after 500ms
}

export function loopRandomBlink(animationManager) {
    const startBlinking = () => {
        triggerBlink(animationManager);

        const nextBlinkInterval = 500 * (1 + Math.random() * 4) + 1000; // Random interval between 1 and 4 seconds
        setTimeout(startBlinking, nextBlinkInterval); // Schedule the next blink
    };
    
    startBlinking(); // Start the blink loop
}
```

In this example, the blink happens randomly every 1 to 4 seconds. The `loopRandomBlink` function ensures the avatar blinks at unpredictable intervals, adding to realism.

---

### **Chained and Complex Animations**

For more advanced animations, we can chain different facial expressions together and control their timing using promises and intervals.

```javascript
// Example 6: Alternate between smiling and sticking the tongue out
export function loopSmileAndStickTongueOut(animationManager) {
    let toggle = true; // Start with a smile

    setInterval(() => {
        if (toggle) {
            smile(animationManager);
            setTimeout(() => stickTongueOut(animationManager), 1000); // Stick tongue out after 1 second
        } else {
            pullTongueIn(animationManager);
            setTimeout(() => frown(animationManager), 1000); // Frown after pulling tongue in
        }
        toggle = !toggle; // Switch to the next expression on the next interval
    }, 2000); // Switch expressions every 2 seconds
}
```

This example toggles between smiling and sticking the tongue out, then frowning and pulling the tongue back in. The interval is set for every 2 seconds, but you can adjust it to suit your needs.

---

### **Head Movements**

You can also control more complex movements such as head tilts using the `AnimationManager`.

```javascript
// Example 7: Head movements
export function headDown(animationManager) {
    animationManager.scheduleChange("54", 100, 900, 0); // Tilt head down using AU54
}

export function headUp(animationManager) {
    animationManager.scheduleChange("54", 0, 900, 0); // Tilt head up using AU54
}
```

In this example, the head tilts down when the intensity is set to 100 and tilts back up when reset to 0.

# Creating your own Module

## 1. Update `src/apps/config.js`

```javascript
{
  name: "Close Eyes",
  description: "This app controls the avatar's eye movements.",
  path: "myApp" // The path where the app logic resides
}
```

Example 2: A **"Blink"** module:

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

### Voice Manager (Uses WebSpeech API, a feature offered in most common browsers based on an open-source standard).
The Voice Manager handles the configuration and management of different voices within the system. It integrates with various text-to-speech (TTS) engines to provide natural and dynamic voice outputs.

### Speech Manager (Microsoft Cognitive Services Text-To-Speech (TTS))
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
