import ActionUnitsList from  '../../../unity/facs/shapeDict'
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
            console.error("Invalid intensity or smooth time provided for AU change.");
            return;
        }

        this.facsLib.setTargetAU(AU.replace("AU", ""), intensityNumber, side, smoothTimeNumber);
        this.facsLib.updateEngine(); // Call render function here to apply changes
    }

    // New method to set the face to neutral
    setFaceToNeutral() {
        ActionUnitsList.forEach((AU)=>{
            this.scheduleChange(AU.id, 0, 750)
        })
        console.log('Setting face to neutral...');
        // Assuming there's a method in facsLib to reset all AUs
        this.facsLib.setNeutral(750);
        this.facsLib.updateEngine();
    }

    // New method to apply AU changes from a JSON object
    applyChangesFromJson(auJson) {
        this.setFaceToNeutral()
        const auData = JSON.parse(auJson);
         // Reset face to neutral before applying changes
        setTimeout(
            auData.forEach(({ au, intensity, duration }) => {
                // Introduce randomness in the delay before applying the change (e.g., 0-2 seconds)
                const delay = Math.random() * 2000; // Random delay in milliseconds
                this.scheduleChange(au, intensity, duration, delay).then(() => {
                    console.log(`Change for ${au} applied after ${delay} ms delay.`);
                });
            }),750)
    }
}

export default AnimationManager;
