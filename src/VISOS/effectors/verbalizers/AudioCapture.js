class AudioCapture {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.stream = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
    }

    async start() {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(this.stream);

        this.mediaRecorder.ondataavailable = (event) => {
            this.audioChunks.push(event.data);
        };

        this.mediaRecorder.start();
    }

    stop() {
        return new Promise((resolve) => {
            this.mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                const audioBuffer = await this.blobToAudioBuffer(audioBlob);
                resolve(audioBuffer);
            };

            this.mediaRecorder.stop();
        });
    }

    async blobToAudioBuffer(blob) {
        const arrayBuffer = await blob.arrayBuffer();
        return this.audioContext.decodeAudioData(arrayBuffer);
    }
}

const audioCapture = new AudioCapture();

export default audioCapture;