// src/apps/blink.js
let blinkInterval;

export default {
    start: (animationManager, speed) => {
        if (!blinkInterval) {
            blinkInterval = setInterval(() => {
                animationManager.setAU(45, 100); // Close eyes
                setTimeout(() => animationManager.setAU(45, 0), 200); // Open eyes
            }, speed);
        }
    },
    stop:()=>{
        if (blinkInterval) {
            clearInterval(blinkInterval);
            blinkInterval = null;
        }
    }
};