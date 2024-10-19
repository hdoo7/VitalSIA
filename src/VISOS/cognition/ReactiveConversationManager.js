import { useState, useEffect, useRef } from 'react';
import ConversationManager from './ConversationManager';

// Reactive Conversation Manager with React Hooks
class ReactiveConversationManager extends ConversationManager {
    constructor(bufferTime, audioToText, voiceManager, wordThreshold = 5) {
        super(bufferTime, audioToText, voiceManager, wordThreshold);
    }

    // Hook to manage conversation state reactively
    useConversation() {
        const [conversationState, setConversationState] = useState({
            status: 'listening', // Possible states: 'listening', 'talking', 'thinking'
            transcribedText: '',
            gptResponse: '',
        });

        // Start conversation method
        const startConversation = () => {
            setConversationState((prevState) => ({ ...prevState, status: 'listening' }));
            this.startListening()
                .then((text) => {
                    setConversationState((prevState) => ({
                        ...prevState,
                        transcribedText: text,
                        status: 'thinking',
                    }));
                    return this.gptReconciler.processText(text);
                })
                .then((gptResponse) => {
                    setConversationState((prevState) => ({
                        ...prevState,
                        gptResponse,
                        status: 'talking',
                    }));
                    return this.enqueueText(gptResponse);
                })
                .then(() => {
                    setConversationState((prevState) => ({
                        ...prevState,
                        status: 'listening',
                    }));
                    this.resumeListening();
                })
                .catch((err) => console.error(err));
        };

        const stopConversation = () => {
            setConversationState((prevState) => ({ ...prevState, status: 'stopped' }));
            this.stopListening();
            this.stopSpeech();
        };

        return { conversationState, startConversation, stopConversation };
    }
}

export default ReactiveConversationManager;