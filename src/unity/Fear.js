class Fear {
    constructor(animationSystem) {
        this.animationSystem = animationSystem;
    }

    start() {
        // Clear any existing animations
        this.animationSystem.clearAll();

        // Immediate mouth opening at the start to indicate shock
        this.animationSystem.scheduleChange("26", 1.0, 0.1, 0); // AU26: Jaw Drop, Intensity: 1.0, Duration: 0.1s, Delay: 0ms

        // Close mouth slightly after a short delay, maintaining some openness
        this.animationSystem.scheduleChange("26", 0.5, 0.1, 500); // AU26: Jaw Drop, Intensity: 0.5, Duration: 0.1s, Delay: 500ms

        // Eyebrow raise to indicate the start of fear response
        this.animationSystem.scheduleChange("1", 1.0, 0.1, 800); // AU1: Inner Brow Raiser, Intensity: 1.0, Duration: 0.1s, Delay: 800ms
        this.animationSystem.scheduleChange("2", 1.0, 0.1, 800); // AU2: Outer Brow Raiser, Intensity: 1.0, Duration: 0.1s, Delay: 800ms

        // Eyelids open wider
        this.animationSystem.scheduleChange("5", 1.0, 0.1, 1000); // AU5: Upper Lid Raiser, Intensity: 1.0, Duration: 0.1s, Delay: 1000ms

        // Slight mouth opening adjustment to maintain the expression of shock
        this.animationSystem.scheduleChange("26", 0.7, 0.1, 1500); // AU26: Jaw Drop, Intensity: 0.7, Duration: 0.1s, Delay: 1500ms

        // Return to a more neutral expression after a delay, but keep a slight tension
        this.animationSystem.scheduleChange("26", 0.2, 0.1, 3000); // AU26: Jaw Drop, Intensity: 0.2, Duration: 0.1s, Delay: 3000ms
        this.animationSystem.scheduleChange("1", 0.2, 0.1, 3200); // AU1: Inner Brow Raiser, Intensity: 0.2, Duration: 0.1s, Delay: 3200ms
        this.animationSystem.scheduleChange("2", 0.2, 0.1, 3200); // AU2: Outer Brow Raiser, Intensity: 0.2, Duration: 0.1s, Delay: 3200ms
        this.animationSystem.scheduleChange("5", 0.2, 0.1, 3400); // AU5: Upper Lid Raiser, Intensity: 0.2, Duration: 0.1s, Delay: 3400ms

        console.log("Fear animation sequence scheduled.");
    }
}

export default Fear;
