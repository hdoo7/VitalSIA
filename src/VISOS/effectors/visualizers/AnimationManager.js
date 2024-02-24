class AnimationManager {
    constructor(facsLib) {
        if (AnimationManager.instance) {
            return AnimationManager.instance;
        }
        this.facsLib = facsLib;
        AnimationManager.instance = this;
    }

    // Schedule an animation change and return a promise that resolves when the animation is done
    scheduleChange(au, intensity, duration, delay) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.applyAUChange(au, intensity, duration);
                // Assume the animation takes the entire duration to complete
                setTimeout(() => {
                    console.log(`Animation ${au} completed.`);
                    resolve(); // Resolve the promise after the animation duration
                }, duration * 1000); // Convert duration to milliseconds for setTimeout
            }, delay);
        });
    }

    // Helper function to apply an AU change
    applyAUChange(AU, intensity, side = 'both', smoothTime = 0.5) {
        // Validate and convert intensity and smoothTime to numbers
        const intensityNumber = Number(intensity);
        const smoothTimeNumber = Number(smoothTime);

        // Check for valid number conversion
        if (isNaN(intensityNumber) || isNaN(smoothTimeNumber)) {
            console.error('Intensity or smoothTime is not a valid number.', { AU, intensity, side, smoothTime });
            return;
        }

        console.log(`Applying AU Change: AU=${AU}, intensity=${intensityNumber}, side=${side}, smoothTime=${smoothTimeNumber}`);
        this.facsLib.setTargetAU(AU, intensityNumber, side, smoothTimeNumber);
        this.facsLib.updateEngine(); // Call render function here to apply changes
    }
}

export default AnimationManager;
