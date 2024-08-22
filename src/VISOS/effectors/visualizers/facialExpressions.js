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
        toggle = !toggle; // Switch for the next interval
    }, 1000); // Adjust interval to match the total duration of the longer animation sequence
}

// Add blink logic with modified doubleBlink function to include looping and randomness
export function triggerBlink(animationManager) {
    // Triggering a blink in Unity using animationManager
    animationManager.scheduleChange("45", 100, 500, 0); // Blink with AU45, intensity of 180, duration 100ms
  
    // Reset blink
    
      animationManager.scheduleChange("45", 3, 500, 500); // Reset blink with AU45, intensity of 0, duration 100ms
    // Adjust based on the blink animation duration in Unity
  }
  
  export function doubleBlinkWithRandomness(animationManager) {
    const blinkOnce = () => triggerBlink(animationManager);
  
    // Initial blink
    blinkOnce();
  
    // Random chance for double blink

  }
  
  export function loopRandomBlink(animationManager) {
    // Function to start the blinking process with random intervals
    const startBlinking = () => {
      doubleBlinkWithRandomness(animationManager);
  
      // Calculate next blink time with a random interval of 1s added to a base interval of 1-3 seconds
      const nextBlinkInterval = 500 * (1 + Math.random() * 4) + 1000; // Base interval [1,3]s + 1s randomness
  
      setTimeout(startBlinking, nextBlinkInterval);
    };
  
    // Start the looping blinking process
    startBlinking();
  }

  export function headDown(animationManager){
    animationManager.scheduleChange("54", 100, 900, 0);
  }
  export function headUp(animationManager){
    animationManager.scheduleChange("54", 2, 900, 0);
  }