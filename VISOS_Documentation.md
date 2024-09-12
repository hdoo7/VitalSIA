
# VISOS Documentation

## Table of Contents
1. [Introduction to VISOS](#introduction-to-visos)
2. [Perception-Action-Cognition Pattern](#perception-action-cognition-pattern)
3. [Reactive Programming and Stream Processing](#reactive-programming-and-stream-processing)
4. [VISOS Core Classes](#visos-core-classes)
   - [VoiceManager](#voicemanager)
   - [AudioToText](#audiototext)
   - [PhonemeExtractor](#phonemeextractor)
   - [VisemeMapper](#visememapper)
5. [Basic Examples](#basic-examples)
   - [Speech Synthesis with VoiceManager](#speech-synthesis-with-voicemanager)
   - [Listening and Speech Recognition with AudioToText](#listening-and-speech-recognition-with-audiototext)
6. [Advanced Examples](#advanced-examples)
   - [Switching Between Multiple Voices](#switching-between-multiple-voices)
   - [Handling Viseme Animations](#handling-viseme-animations)
   - [Continuous Listening and Immediate Feedback](#continuous-listening-and-immediate-feedback)
7. [TextToListener and TextToListenerWithFollowUp](#texttolistener-and-texttolistenerwithfollowup)
8. [Related VISOS Classes](#related-visos-classes)

---

## Introduction to VISOS

The **VISOS** framework provides a structure for building interactive voice, speech recognition, and animation-based applications. It is designed to support dynamic interaction between a user and an application, allowing for speech synthesis, speech recognition, and synchronized animation (such as lip-sync) based on the speech input or output.

The core components of VISOS revolve around handling the flow of information through perception, action, and cognition, enabling systems that are highly reactive and capable of stream-based processing.

---

## Perception-Action-Cognition Pattern

At the heart of VISOS is the **Perception-Action-Cognition (PAC)** pattern, which mirrors the way humans perceive stimuli, take action, and think about decisions. This pattern is used throughout VISOS to enable responsive, real-time interaction in applications.

- **Perception**: Collects and processes sensory input (e.g., speech recognition via **`AudioToText`**).
- **Action**: Executes behaviors based on the input (e.g., speech output via **`VoiceManager`** or animation actions).
- **Cognition**: Handles the decision-making or processing logic (e.g., determining the next response or adjusting speech timing).

In VISOS, these three components interact continuously to form a loop of perception, action, and cognition. For example, an application can perceive the user’s speech, decide the appropriate response (cognition), and then use speech synthesis to provide a vocal response (action).

---

## Reactive Programming and Stream Processing

VISOS adopts **reactive programming** principles, where applications react to changes in streams of data (such as user input or speech). This means that instead of traditional request-response patterns, VISOS components continuously process and respond to incoming streams of data, enabling a fluid and real-time interaction model.

In VISOS:
- **Streams** represent continuous flows of data (e.g., voice input or speech synthesis).
- **Events** trigger reactions (e.g., receiving text from the **`AudioToText`** stream and reacting by generating speech).
- **Reactive Handlers** are used to process incoming streams and trigger specific actions.

**Example:**
In the case of the **`FrenchVocabularyQuiz`** module, once a question is spoken, the system immediately starts listening for a user response (perception), processes the response (cognition), and gives feedback through speech synthesis (action). The entire flow is stream-based and event-driven.

---

## VISOS Core Classes

### VoiceManager

The **`VoiceManager`** class manages the voice synthesis and handles text-to-speech (TTS). It can control different voices, manage speech queues, and integrate with animations like viseme synchronization for lip-syncing.

#### Methods:

1. **`getInstance(animationManager, pitchEnhance = false)`**
   - Returns the singleton instance of `VoiceManager`.
   - **Example Usage:**
   ```javascript
   const voiceManager = VoiceManager.getInstance(animationManager);
   ```

2. **`setVoice(voiceName)`**
   - Sets the active voice used by the speech synthesis engine.
   - **Example Usage:**
   ```javascript
   voiceManager.setVoice('Google français');
   ```

3. **`enqueueText(text)`**
   - Adds text to the queue to be spoken sequentially.
   - **Example Usage:**
   ```javascript
   voiceManager.enqueueText('Bonjour, comment allez-vous ?');
   ```

4. **`synthesizeSpeech(text)`**
   - Synthesizes and speaks the provided text, returning a promise that resolves when the speech is completed.
   - **Example Usage:**
   ```javascript
   voiceManager.synthesizeSpeech('Merci beaucoup!').then(() => {
       console.log('Speech complete!');
   });
   ```

5. **`stopSpeech()`**
   - Stops all ongoing speech and clears the speech queue.

---

### AudioToText

The **`AudioToText`** class handles speech recognition. It continuously listens for spoken input and converts it into transcribed text. It is used primarily in scenarios where the application needs to understand and process spoken words from a user.

#### Methods:

1. **`startContinuousRecognition(callback)`**
   - Starts continuously listening for speech input and invokes the provided callback with the transcribed text.
   - **Example Usage:**
   ```javascript
   audioToText.startContinuousRecognition((transcribedText) => {
       console.log('User said:', transcribedText);
   });
   ```

2. **`stopRecognition()`**
   - Stops the ongoing speech recognition process.
   - **Example Usage:**
   ```javascript
   audioToText.stopRecognition();
   ```

---

### TextToListener and TextToListenerWithFollowUp

#### TextToListener

The **`TextToListener`** class listens for specific key phrases in a stream of text. It processes the input, checks if any of the predefined phrases are detected, and triggers appropriate actions when a match is found.

#### Methods:

1. **`detectKeyPhrase(text)`**
   - **Example Usage:**
   ```javascript
   const listener = new TextToListener(['hello', 'start']);
   const detectedPhrase = listener.detectKeyPhrase('hello there!');
   ```

2. **`listenForStream(text)`**
   - Processes a stream of text input and returns a promise that resolves with the detected phrase.
   - **Example Usage:**
   ```javascript
   listener.listenForStream('hello there!').then((phrase) => {
       console.log(`Trigger detected: ${phrase}`);
   });
   ```

---

#### TextToListenerWithFollowUp

**`TextToListenerWithFollowUp`** extends **`TextToListener`** to handle more complex listening scenarios, particularly those requiring follow-up interactions after a phrase is detected.

#### Methods:

1. **`listenForFollowUp(text)`**
   - Listens for follow-up phrases or responses after the initial trigger phrase is detected.
   - **Example Usage:**
   ```javascript
   textToListenerWithFollowUp.listenForFollowUp('yes, continue').then((followUp) => {
       console.log('Follow-up detected:', followUp);
   });
   ```

2. **`resumeListeningAfterResponse()`**
   - Resumes listening for more responses or follow-ups after an initial user input has been processed.
   - **Example Usage:**
   ```javascript
   textToListenerWithFollowUp.resumeListeningAfterResponse();
   ```

---

## Related VISOS Classes

1. **PhonemeExtractor**
   - Extracts phonemes from spoken text to assist in lip-syncing animations.

2. **VisemeMapper**
   - Maps phonemes to corresponding visemes for smoother and more accurate visual speech animations.

3. **PitchAnalyzer**
   - Analyzes pitch in speech to apply pitch-based animations or modifications.

---
