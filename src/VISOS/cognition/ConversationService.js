export default class ConversationService {
    constructor(audioToText, textToListenerWithFollowUp, gptReconciler, voiceManager) {
        this.audioToText = audioToText;
        this.textToListenerWithFollowUp = textToListenerWithFollowUp;
        this.gptReconciler = gptReconciler;
        this.voiceManager = voiceManager;
        this.isListening = false;
        this.isTalking = false;
        this.conversationStarted = false;
        this.agentSpeech = '';  // Track what the agent said last
    }

    // Start listening for phrases and process the input accordingly
    startListening() {
        return new Promise(async (resolve, reject) => {
            if (this.isListening || this.isTalking) return reject('Already listening or talking');
            
            this.isListening = true;
            console.log('Starting to listen for input...');
            try {
                const textStream = this.audioToText.startRecognition();

                // Handle the transcribed text from the listener
                for await (const text of this.textToListenerWithFollowUp.startListening(textStream)) {
                    // Ignore the agent's own synthesized speech
                    if (this.agentSpeech && text.includes(this.agentSpeech)) {
                        console.log('Ignoring agent’s own speech.');
                        continue;
                    }

                    resolve(text);  // Resolve with the user's transcribed text
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    // Stop listening
    stopListening() {
        return new Promise((resolve, reject) => {
            if (!this.isListening) return reject('Not currently listening');
            
            this.isListening = false;
            this.audioToText.stopRecognition();
            console.log('Stopped listening.');
            resolve();
        });
    }

    // Start talking and mute listening during speech
    startTalking(responseText) {
        return new Promise(async (resolve, reject) => {
            if (this.isTalking) return reject('Already talking');
            
            this.isTalking = true;
            this.isListening = false;  // Mute recognition while talking
            console.log('Speaking response...');

            try {
                this.agentSpeech = responseText;  // Store the agent's speech
                await this.voiceManager.enqueueText(responseText);
                this.isTalking = false;
                this.isListening = true;  // Resume listening after talking
                resolve();
            } catch (error) {
                this.isTalking = false;
                this.isListening = true;
                reject(error);
            }
        });
    }

    // Stop talking immediately
    stopTalking() {
        return new Promise((resolve, reject) => {
            if (!this.isTalking) return reject('Not currently talking');

            this.isTalking = false;
            this.voiceManager.stopSpeech();
            this.isListening = true;  // Resume listening after interruption
            console.log('Stopped talking.');
            resolve();
        });
    }

    // Handle the trigger phrase response
    handleTriggerPhrase(triggerPhrase, followUpText = null) {
        return new Promise(async (resolve, reject) => {
            try {
                if (followUpText) {
                    // If follow-up text exists, process it with GPT
                    const response = await this.gptReconciler.processText(followUpText, 'Answer seriously:');
                    await this.startTalking(`Let me check that for you... ${response}`);
                    resolve(response);
                } else {
                    // If no follow-up, respond with a simple greeting
                    const greetingResponse = 'Hello! I am here to help. You can ask me about the weather, or anything else.';
                    await this.startTalking(greetingResponse);
                    resolve(greetingResponse);
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}