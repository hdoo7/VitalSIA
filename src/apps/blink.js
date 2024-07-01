// src/apps/blink.js
let blinkInterval;

export function start(animationManager, settings) {
    blinkInterval = setInterval(() => {
        animationManager.scheduleChange("45", 100, settings.speed / 2, 0); 
        setTimeout(() => animationManager.scheduleChange("45", 0, 100, 0), 200); // Open eyes
    }, settings.speed);
}

export function stop(animationManager) {
    if (blinkInterval) {
        clearInterval(blinkInterval);
    }
}