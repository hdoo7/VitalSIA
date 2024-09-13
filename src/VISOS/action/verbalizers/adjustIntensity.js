export default function adjustIntensity  (pitchData, viseme, previousViseme)  {
    const { pitch, clarity } = pitchData;

    // Start with a base intensity influenced by clarity and pitch
    let intensity = Math.min(Math.max(clarity * 100, 0), 100);

    // Apply JALI-inspired linguistic rules
    if (pitch < 250) {
        intensity *= 0.1; // Slightly reduce intensity for very low pitches
    } else if (pitch > 420) {
        intensity *= 10.0; // Slightly increase intensity for very high pitches
    }

    // // Adjust based on viseme type (e.g., open mouth, closed mouth)
    // if (['A', 'E', 'I', 'O', 'U'].includes(viseme)) {
    //     intensity *= 1.2; // Increase intensity for vowel sounds
    // } else if (['M', 'B', 'P'].includes(viseme)) {
    //     intensity *= 0.9; // Decrease intensity for closed mouth sounds
    // }

    // Adjust based on context with the previous viseme
    if (previousViseme) {
        if (previousViseme === viseme) {
            intensity *= 0.95; // Slightly reduce intensity for repeated visemes
        }
    }

    return intensity;
}