import natural from 'natural';

export default class AudioToText {
    constructor(recognitionType = 'webspeech') {
        this.recognition = null;
        this.sentenceTokenizer = new natural.SentenceTokenizer();  // Tokenizer for sentences
        this.initRecognition(recognitionType);
    }

    initRecognition(recognitionType) {
        if (recognitionType === 'webspeech') {
            this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            this.recognition.interimResults = false;
            this.recognition.continuous = true;
            this.recognition.lang = 'en-US';
        } else {
            console.error("Unsupported recognition type");
        }
    }

    // Generator to yield transcribed sentences as utterances
    async *startRecognition() {
        const finalTranscript = [];

        this.recognition.onresult = (event) => {
            const results = event.results;
            for (let i = event.resultIndex; i < results.length; i++) {
                if (results[i].isFinal) {
                    finalTranscript.push(results[i][0].transcript.trim());
                }
            }

            // Split the transcribed text into sentences (utterances)
            const sentences = this.sentenceTokenizer.tokenize(finalTranscript.join(' '));

            // Yield each sentence as a transcribed utterance
            for (let sentence of sentences) {
                this.currentCallback(sentence);  // Pass the sentence to the callback
            }
        };

        this.recognition.onerror = (event) => {
            console.error(event.error);
        };
        
        this.recognition.start();

        // Keep yielding until recognition is stopped
        while (true) {
            await new Promise(resolve => {
                this.currentCallback = resolve;  // Save the current resolve function to call on result
            });
        }
    }

    stopRecognition() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}