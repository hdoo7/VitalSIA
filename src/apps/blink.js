// src/apps/blink.js
let blinkInterval;

export function start(animationManager, settings) {
    blinkInterval = setInterval(() => {
        animationManager.scheduleChange("45", 100, 100, 0); 
        setTimeout(() => animationManager.scheduleChange("45", 0, 100, 0), 100); // Open eyes
    }, settings.speed);
}

export function stop(animationManager) {
    if (blinkInterval) {
        clearInterval(blinkInterval);
    }
}