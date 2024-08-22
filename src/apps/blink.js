// Declare a variable to hold the interval ID for the blinking action
let blinkInterval;

/**
 * Starts the blinking action using the provided animation manager and settings.
 *
 * @param {Object} animationManager - The manager responsible for controlling facial animations.
 * @param {Object} settings - The configuration settings for the blink action, such as speed.
 */
export function start(animationManager, settings) {
    // Set up an interval to repeatedly trigger the blink action at the specified speed
    blinkInterval = setInterval(() => {
        // Schedule the closing of the eyes by setting the intensity of AU 45 (Action Unit for blinking) to 100
        // The duration for closing the eyes is set to half of the specified speed in the settings
        animationManager.scheduleChange("45", 200, settings.speed / 2, 0); 
        
        // After 200 milliseconds, schedule the opening of the eyes by setting the intensity of AU 45 back to 0
        setTimeout(() => animationManager.scheduleChange("45", 0, 100, 0), 200); // Open eyes
    }, settings.speed); // Repeat this process at intervals specified by the speed in the settings
}

/**
 * Stops the blinking action by clearing the interval.
 *
 * @param {Object} animationManager - The manager responsible for controlling facial animations.
 */
export function stop(animationManager) {
    // If the blinking interval is active, clear it to stop the blinking action
    if (blinkInterval) {
        clearInterval(blinkInterval);
    }
}