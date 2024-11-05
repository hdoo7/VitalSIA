import { useState, useEffect, useRef } from 'react';
import { PitchDetector } from 'pitchy';  // Assuming we're using Pitchy for pitch detection

const useAudioIntensity = (audioStream) => {
    const [currentPitch, setCurrentPitch] = useState(0);
    const [currentVolume, setCurrentVolume] = useState(0);
    const [history, setHistory] = useState([]);  // History of pitch and volume over time

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const pitchDetectorRef = useRef(null);
    const dataArrayRef = useRef(null);

    useEffect(() => {
        if (!audioStream) return;  // Exit if no audio stream

        // Initialize the Audio Context and Analyser Node
        audioContextRef.current = audioStream;
        console.log(audioStream)
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;

        const audioSource = audioContextRef.current.createMediaStreamSource(audioStream);
        audioSource.connect(analyserRef.current);

        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Float32Array(bufferLength);

        pitchDetectorRef.current = PitchDetector.forFloat32Array(analyserRef.current.fftSize);

        // Function to calculate pitch and volume
        const processAudio = () => {
            analyserRef.current.getFloatTimeDomainData(dataArrayRef.current);

            // Get pitch and clarity from pitch detector
            const [pitch, clarity] = pitchDetectorRef.current.findPitch(
                dataArrayRef.current,
                audioContextRef.current.sampleRate
            );

            // Calculate volume as the root mean square of the waveform
            const volume = calculateVolume(dataArrayRef.current);

            // Update state with the current pitch and volume
            setCurrentPitch(pitch);
            setCurrentVolume(volume);

            // Update the history of pitch and volume
            setHistory((prevHistory) => [
                ...prevHistory.slice(-99),  // Keep the last 100 entries
                { pitch, volume },
            ]);

            requestAnimationFrame(processAudio);  // Continue processing
        };

        // Start processing the audio
        processAudio();

        // Clean up when the component is unmounted
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [audioStream]);

    // Utility function to calculate volume as RMS
    const calculateVolume = (dataArray) => {
        let sum = 0.0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i] * dataArray[i];
        }
        return Math.sqrt(sum / dataArray.length);  // Return root mean square (RMS)
    };

    // Return the current pitch, volume, and history for the UI to use
    return { currentPitch, currentVolume, history };
};
export default useAudioIntensity;