// facialExpressions.js

export function smile(animationManager) {
    animationManager.scheduleChange("12", 88, 250, 0); // Parameters: , intensity, duration, delay
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

// facialExpressions.js
export function stickTongueOut(animationManager) {
    // Schedule tongue show and bulge with appropriate AUs and intensities
    animationManager.scheduleChange("36", 180, 250, 0); // Tongue show
    animationManager.scheduleChange("19", 180, 250, 250); // Tongue bulge
    // Assume start() now returns a promise that resolves when all scheduled animations are done
}

export function pullTongueIn(animationManager) {
    // Schedule tongue show and bulge with appropriate AUs and intensities
    animationManager.scheduleChange("36", 0, 250, 0); // Tongue show
    animationManager.scheduleChange("19", 0, 250, 250); // Tongue bulge
    // Assume start() now returns a promise that resolves when all scheduled animations are done
}

export function loopSmileAndStickTongueOut(animationManager) {
    let toggle = Math.floor(Math.random()*2)// Toggle between smile and stick tongue out

    setInterval(() => {
        if (toggle) {
            frown(animationManager);
            pullTongueIn(animationManager)
        } else {
            stickTongueOut(animationManager);
            smile(animationManager);
        }
        toggle = !toggle; // Switch for the next interval // Start scheduled animations
    }, 1000); // Adjust interval to match the total duration of the longer animation sequence
}