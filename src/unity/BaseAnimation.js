class BaseAnimation {
    constructor(engine) {
        this.engine = engine;
        this.auRequests = new Map(); // Stores the most recent request for each AU
        this.running = false;
    }

    // Queue an AU change request
    requestChange(AU, intensity, duration) {
        this.auRequests.set(AU, { intensity, duration });
    }

    // Start the animation processing loop
    start() {
        if (this.running) return; // Prevent multiple loops
        this.running = true;

        const processAnimations = () => {
            if (!this.running) return; // Stop the loop if needed

            // Apply the most recent request for each AU
            this.auRequests.forEach((request, AU) => {
                this.engine.setAU(AU, request.intensity, request.duration);
                // Optionally, remove the request from the map if it should only be applied once
                // this.auRequests.delete(AU);
            });

            // Continue the loop at approximately 60Hz
            setTimeout(processAnimations, 1000 / 60);
        };

        processAnimations();
    }

    // Stop the animation processing loop
    stop() {
        this.running = false;
        this.auRequests.clear(); // Optionally clear all pending requests
    }

    // Clear specific or all AU requests
    clearRequests(AU = null) {
        if (AU) {
            this.auRequests.delete(AU);
        } else {
            this.auRequests.clear();
        }
    }
}
