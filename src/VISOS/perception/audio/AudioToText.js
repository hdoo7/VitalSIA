export default class AudioToText {
    constructor(recognitionType = 'webspeech') {
        this.recognition = null;
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

    startRecognition() {
        return new Promise((resolve, reject) => {
            const finalTranscript = [];
            this.recognition.onresult = (event) => {
                const results = event.results;
                for (let i = event.resultIndex; i < results.length; i++) {
                    if (results[i].isFinal) {
                        finalTranscript.push(results[i][0].transcript.trim());
                    }
                }

                const chunkedResponses = this.chunkify(finalTranscript.join(' ')); // Chunk the transcript
                resolve(chunkedResponses);
            };

            this.recognition.onerror = (event) => reject(event.error);
            this.recognition.onend = () => console.log("Speech recognition ended.");
            this.recognition.start();
        });
    }

    chunkify(response, maxLength = 120) {
        const chunks = [];
        let currentChunk = '';

        response.split(' ').forEach(word => {
            if (currentChunk.length + word.length + 1 > maxLength) {
                chunks.push(currentChunk);
                currentChunk = word;
            } else {
                currentChunk += (currentChunk.length === 0 ? '' : ' ') + word;
            }
        });

        if (currentChunk.length > 0) {
            chunks.push(currentChunk);
        }

        return chunks;
    }

    stopRecognition() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}