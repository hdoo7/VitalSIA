
# VISOS Documentation

This documentation outlines the key ES6 modules and classes within the **VISOS** framework. The VISOS system is designed for interactive systems that involve **Perception**, **Cognition**, and **Action** to create reactive, stream-based interactions like virtual agents or conversational AI systems.

**VISOS is based off of the orignal eEVA's "mainframe" archecture, developed by Dr. Ubbo Visser of Universtity of Miami's RoboCanes Robotics lab, in collaboration with VIsage Laboratory. All code and Archecture courtesy of Jonathan Sutton Fields while voluntering at Visage Labs.
**---

## Table of Contents
- [Introduction](#introduction)
- [Perception](#perception)
  - [AudioToText](#audiototext)
  - [ContinuousTextListener](#continuoustextlistener)
  - [TextToListener](#texttolistener)
  - [TextToListenerWithFollowUp](#texttolistenerwithfollowup)
  - [WebcamManager](#webcammanager)
  - [SmileControl](#smilecontrol)
- [Cognition](#cognition)
  - [TextToGptReconciler](#texttogptreconciler)
- [Action](#action)
  - [VoiceManager](#voicemanager)
  - [SpeechManager](#speechmanager)
  - [AnimationManager](#animationmanager)
  - [EffectorManager](#effectormanager)
  - [Facial Expressions and Visualizers](#facial-expressions-and-visualizers)

---

## Introduction

The **VISOS** framework is built around the **Perception-Action-Cognition** pattern, enabling responsive systems to capture input, process it intelligently, and respond appropriately. VISOS is designed for applications that involve continuous conversation, such as virtual agents, speech synthesis, and animation-based systems.

This documentation details both the classes and ES6 modules that make up VISOS and provides examples of their usage.

---

## Perception

### **AudioToText**

This class handles continuous speech recognition using the **Web Speech API**.

#### **Properties**:
- `recognition`: The `webkitSpeechRecognition` instance that manages the recognition process.
- `isListening`: Boolean indicating whether recognition is currently active.

#### **Methods**:
- **`initializeRecognizer()`**
  - Initializes the Web Speech API.
  - Example:
    ```javascript
    const audioToText = new AudioToText();
    audioToText.initializeRecognizer();
    ```

- **`startContinuousRecognition(onRecognizedCallback)`**
  - Starts continuous recognition and calls the provided callback with the recognized text.
  - Example:
    ```javascript
    audioToText.startContinuousRecognition((recognizedText) => {
        console.log("Recognized:", recognizedText);
    });
    ```

- **`stopRecognition()`**
  - Stops the recognition process.
  - Example:
    ```javascript
    audioToText.stopRecognition();
    ```

---

### **ContinuousTextListener**

Handles continuous listening for trigger phrases and integrates with **AudioToText** for transcription.

#### **Properties**:
- `audioToText`: Instance of `AudioToText`.
- `bufferTime`: Time delay before resuming listening after speaking.

#### **Methods**:
- **`startContinuousListening(setStatus, toast)`**
  - Starts listening for text and processes it in a loop.
  - Example:
    ```javascript
    continuousTextListener.startContinuousListening(setStatus, toast);
    ```

- **`handleTriggerPhrase(text, setStatus, toast)`**
  - Handles trigger phrases by checking for specific phrases and generating responses.
  - Example:
    ```javascript
    handleTriggerPhrase('Hey Amy', setStatus, toast);
    ```

---

### **TextToListener**

Detects and listens for key phrases in recognized text.

#### **Methods**:
- **`listen(text)`**
  - Listens for key phrases in the provided text.
  - Example:
    ```javascript
    const listener = new TextToListener(['Hey Amy']);
    listener.listen('Hey Amy, how are you?');
    ```

---

### **TextToListenerWithFollowUp**

Extends `TextToListener` to support follow-up interactions.

#### **Methods**:
- **`listenForStream(text)`**
  - Processes a stream of text and listens for trigger phrases and follow-ups.
  - Example:
    ```javascript
    listenerWithFollowUp.listenForStream('Hey Amy, tell me a story');
    ```

---

### **WebcamManager**

Manages video capture from a webcam for visual input.

---

### **SmileControl**

Detects facial expressions such as smiles using webcam input.

---

## Cognition

### **TextToGptReconciler**

Sends input text to OpenAI’s GPT models and receives responses.

#### **Methods**:
- **`processText(text, instruction)`**
  - Processes text and sends it to GPT for a response.
  - Example:
    ```javascript
    const reconciler = new TextToGptReconciler('your-api-key');
    reconciler.processText('Tell me a joke');
    ```

---

## Action

### **VoiceManager**

Manages speech synthesis using the browser's built-in Web Speech API.

#### **Methods**:
- **`setVoice(voiceName)`**
  - Sets the voice to a specific speech synthesis voice.
  - Example:
    ```javascript
    voiceManager.setVoice('Google UK English Female');
    ```

- **`enqueueText(text)`**
  - Adds text to the speech queue for synthesis.
  - Example:
    ```javascript
    voiceManager.enqueueText('Hello, how are you?');
    ```

---

### **SpeechManager**

Handles speech synthesis and controls speech output, including managing visemes for facial animations.

#### **Methods**:
- **`initSynthesizer()`**
  - Initializes the speech synthesizer.
  - Example:
    ```javascript
    const speechManager = new SpeechManager(animationManager);
    speechManager.initSynthesizer();
    ```

- **`enqueueText(text)`**
  - Adds text to the speech queue for synthesis.
  - Example:
    ```javascript
    speechManager.enqueueText('Let’s start the presentation.');
    ```

---

### **AnimationManager**

Handles facial animations and applies visemes during speech.

#### **Methods**:
- **`applyAUChange(AU, targetIntensity, duration)`**
  - Applies action unit (AU) changes for facial animation.
  - Example:
    ```javascript
    animationManager.applyAUChange('AU01', 80, 1000);
    ```

---

### **EffectorManager**

Coordinates the various **Effectors** within the system, managing outputs like animations, sounds, and more.

---

### **Facial Expressions and Visualizers**

#### **ComplexEmotion**

Represents complex emotional states and translates them into facial expressions.

---

## Conclusion

This documentation outlines both the ES6 modules and classes within VISOS, offering examples of how they work and how to integrate them into a conversation-based application. With the **Perception**, **Cognition**, and **Action** layers, VISOS provides a complete solution for developing dynamic, real-time interactive agents.

© 2024 Christine Lisetti, Visage Labs. All rights reserved.
