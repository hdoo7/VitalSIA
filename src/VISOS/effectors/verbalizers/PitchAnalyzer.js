import { PitchDetector } from "pitchy";

export default class PitchAnalyzer {
    constructor(audioContext) {
        this.audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
        this.analyserNode = this.audioContext.createAnalyser();
        this.detector = PitchDetector.forFloat32Array(this.analyserNode.fftSize);
        this.input = new Float32Array(this.detector.inputLength);
        this.minVolumeDecibels = -10;

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            this.audioContext.createMediaStreamSource(stream).connect(this.analyserNode);
        });
    }

    analyzePitch() {
        this.analyserNode.getFloatTimeDomainData(this.input);
        const [pitch, clarity] = this.detector.findPitch(this.input, this.audioContext.sampleRate);
        console.log(`Pitch: ${pitch} Hz, Clarity: ${clarity}`);
        return { pitch, clarity };
    }
}