let blinkInterval;

export function start(animationManager, settings) {
    // Ensure the speed is within the specified min and max range
    const speed =  settings.speed;
    
    // Define the blink duration (time to close and open the eyes)
    const blinkDuration = 200; // Milliseconds (time to fully close and then open the eyes)

    // Calculate the time between blinks by subtracting the blink duration from the speed
    const timeBetweenBlinks = speed;
    
    // Clear any existing interval to avoid overlapping blinks
    if (blinkInterval) {
        clearInterval(blinkInterval);
    }

    // Set up the blink interval
    blinkInterval = setInterval(() => {
        // Close eyes
        animationManager.scheduleChange("45", 200, 100, 0); // Close eyes
        // Open eyes after 200ms delay (after the close animation)
        setTimeout(()=>animationManager.scheduleChange("45", 0, 100, 0), 400); // Open300 eyes
    }, speed +400);
}

export function stop(animationManager) {
    if (blinkInterval) {
        clearInterval(blinkInterval);
    }
}