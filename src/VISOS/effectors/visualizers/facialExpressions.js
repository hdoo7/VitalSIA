// facialExpressions.js

export function smile(animationManager) {
    animationManager.scheduleChange("12", 88, 250, 0); // Parameters: AU, intensity, duration, delay
    // Assume start() now returns a promise that resolves when all scheduled animations are done
    // Start the animation and return the promise
}

export function frown(animationManager) {
    animationManager.scheduleChange("12", 0, 500, 250); // Frown parameters
    
}

export function loopSmileAndFrown(animationManager) {
    setInterval(() => {
    smile(animationManager);
    frown(animationManager);
    },750);
}
