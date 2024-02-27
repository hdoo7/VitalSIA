import { PitchDetector } from 'pitchy';
import BaseStreamManager from './BaseStreamManager';

export default class AudioToPitch extends BaseStreamManager {
    constructor(audioContext, onData) {
        super(audioContext);
        this.onData = onData;
        this.init();
    }

    async init() {
        const source = await this.initMicrophone();
        if (!source) return;

        const processor = this.audioContext.createScriptProcessor(2048, 1, 1);
        source.connect(processor);
        processor.connect(this.audioContext.destination);

        const detector = PitchDetector.forFloat32Array(processor.bufferSize);
        const input = new Float32Array(detector.inputLength);

        processor.onaudioprocess = (event) => {
            input.set(event.inputBuffer.getChannelData(0));
            const [pitch, clarity] = detector.findPitch(input, this.audioContext.sampleRate);

            if (clarity > 0.75) { // Adjust clarity threshold as needed
                this.onData({ pitch, clarity });
            }
        };
    }
}
