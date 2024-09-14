
# eEVA Workbench.

_eEVA Workbench is a derivative of Dr. Lisetti's eEVA mainframe architecture developed by Dr. Lisetti. The code was developed by Jonathan Sutton Fields for his Master Thesis with Dr. Lisetti.  It is to be used for educational and research purposes only by students registered in Dr. Lisetti's courses or involved with Dr. Lisetti's VISAGE research laboratory.  It is copyrighted and protected under the Proprietary Software License Agreement provided (see license).

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

## Installation

To install the system on your local machine, follow these steps based on your operating system.

### Windows

1. Install Git and Node.js using Chocolatey:
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
import AnimationManager from './src/VISOS/action/visualizers/AnimationManager';

const animationManager = new AnimationManager();
// Use animationManager to control animations
```

## Setting up an App

In `app.js`, you can set up the initial environment and include the main components of the system, such as the Animation Manager and the newly added UI sensor components.

Example:
```javascript
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import SmileControl from './src/VISOS/perception/UI/SmileControl';
import AnimationManager from './src/VISOS/action/visualizers/AnimationManager';

function App() {
  const animationManager = new AnimationManager();
  // Setup and use animationManager as needed

  return (
    <ChakraProvider>
      <div className="App">
        <h1>EVA-libre System</h1>
        <SmileControl />
        {/* Include other UI components as needed */}
      </div>
    </ChakraProvider>
  );
}

export default App;
```

## Voice Manager and Speech Manager

### Voice Manager
The Voice Manager handles the configuration and management of different voices within the system. It integrates with various text-to-speech (TTS) engines to provide natural and dynamic voice outputs.

### Speech Manager (MS TTS)
The Speech Manager is specifically designed to work with Microsoft Text-to-Speech (TTS) services. It handles the conversion of text to speech using MS TTS, providing an interface for easy integration into applications.

Example setup and usage:
```javascript
import VoiceManager from './src/VISOS/action/verbalizers/VoiceManager';
import SpeechManager from './src/VISOS/action/verbalizers/SpeechManager';

// Initialize Voice and Speech Managers
const voiceManager = new VoiceManager();
const speechManager = new SpeechManager(voiceManager);

// Use speechManager to convert text to speech
speechManager.speak("Hello, this is a test using MS TTS.");
```

For detailed documentation on additional components and usage, refer to the respective component documentation.

