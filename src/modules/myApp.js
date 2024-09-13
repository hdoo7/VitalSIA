// Declare a variable to hold the interval ID for the blinking action
let blinkInterval;

/**
 * Starts the blinking action using the provided animation manager and settings.
 *
 * @param {Object} animationManager - The manager responsible for controlling facial animations.
 * @param {Object} settings - The configuration settings for the blink action, such as speed.
 */
export function start(animationManager, settings)   {
    animationManager.scheduleChange("45", 200, 100, 0); 
}
/**
 * Stops the blinking action by clearing the interval.
 *
 * @param {Object} animationManager - The manager responsible for controlling facial animations.
 */
export function stop(animationManager) {
    // If the blinking interval is active, clear it to stop the blinking action
    animationManager.scheduleChange("45", 0, 100, 0); 
}