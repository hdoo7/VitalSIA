import { Pitchy } from 'pitchy';

class PitchAnalyzer {
    constructor() {
        this.pitchy = Pitchy();
    }

    analyze(audioBuffer) {
        const sampleRate = audioBuffer.sampleRate;
        const audioData = audioBuffer.getChannelData(0);
        const result = this.pitchy.process(audioData, sampleRate);
        console.log('Pitch:', result.pitch);
        console.log('Confidence:', result.confidence);
    }
}

const pitchAnalyzer = new PitchAnalyzer();

export default pitchAnalyzer;