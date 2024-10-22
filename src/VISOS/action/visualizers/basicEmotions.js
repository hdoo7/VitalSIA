export function showHappy(animationManager, intensity = 100, duration = 250) {
    // Happy emotion using smile (AU12) and other happiness-related AUs
    animationManager.scheduleChange("12", intensity, duration, 0);  // Smile (AU12)
    animationManager.scheduleChange("6", intensity * 0.6, duration, 0);    // Cheek raise (AU6) for happiness
}

export function showSad(animationManager, intensity = 100, duration = 500) {
    // Sad emotion with frown (AU1) and related AUs for sadness
    animationManager.scheduleChange("1", intensity, duration, 0);    // Inner brow raise (AU1)
    animationManager.scheduleChange("15", intensity * 0.6, duration, 0);   // Lip corner depressor (AU15)
}

export function showAngry(animationManager, intensity = 100, duration = 500) {
    // Angry emotion with AU4 (brow lower) and AU7 (tight eyelids)
    animationManager.scheduleChange("4", intensity, duration, 0);   // Brow lower (AU4)
    animationManager.scheduleChange("7", intensity, duration, 0);   // Tighten eyelids (AU7)
}

export function showFear(animationManager, intensity = 100, duration = 500) {
    // Fear emotion using wide eyes (AU5) and tense mouth (AU20)
    animationManager.scheduleChange("5", intensity, duration, 0);   // Upper eyelid raise (AU5)
    animationManager.scheduleChange("20", intensity * 0.8, duration, 0);   // Lip stretch (AU20)
}

export function showSurprise(animationManager, intensity = 100, duration = 250) {
    // Surprise emotion with wide eyes (AU5) and raised eyebrows (AU2)
    animationManager.scheduleChange("5", intensity, duration, 0);   // Upper eyelid raise (AU5)
    animationManager.scheduleChange("2", intensity * 0.8, duration, 0);    // Outer brow raise (AU2)
}

export function showDisgust(animationManager, intensity = 100, duration = 500) {
    // Disgust emotion using AU9 (nose wrinkle) and AU10 (upper lip raise)
    animationManager.scheduleChange("9", intensity, duration, 0);    // Nose wrinkle (AU9)
    animationManager.scheduleChange("10", intensity * 0.8, duration, 0);   // Upper lip raise (AU10)
}