import AnimationManager from './AnimationManager.js';

// Assuming direct usage of AnimationManager's singleton instance
const animationManager = new AnimationManager();

// Function to start the happy animation sequence
function startHappyAnimation() {
    // Example animation sequence for a happy expression
    // Clear any existing animations if necessary
    // animationManager.clearAll(); // Uncomment if there's a method to clear animations

    // Schedule changes for a happy expression
    // Note: The specific AU (Action Unit) codes and parameters would need to be adjusted based on the desired expression and the system's capabilities

    // Smile - Lip Corner Puller (AU12)
    animationManager.scheduleChange("12", 1.0, 0.5, 0); // Intensity: 1.0, Duration: 0.5s, Delay: 0ms

    // Cheek Raiser (AU6) - Creates a smiling eye effect
    animationManager.scheduleChange("6", 0.5, 0.5, 100); // Intensity: 0.5, Duration: 0.5s, Delay: 100ms

    // Lower Eyelid Raise (AU7) - Adds to the smiling eye effect
    animationManager.scheduleChange("7", 0.3, 0.5, 100); // Intensity: 0.3, Duration: 0.5s, Delay: 100ms

    console.log("Happy animation sequence initiated.");
}

// Optionally, you can immediately invoke the function or export it to be used elsewhere
// startHappyAnimation();

// Export the startHappyAnimation function if it needs to be triggered from other parts of the application
export { startHappyAnimation };
