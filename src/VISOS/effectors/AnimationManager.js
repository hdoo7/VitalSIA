// AnimationManager.js
class AnimationManager {
    constructor(facsLib) {
        if (AnimationManager.instance) {
            return AnimationManager.instance;
        }
        this.facsLib = facsLib;
        this.animations = [];
        this.isRunning = false;
        this.auStates = {}; // For reconciling AU changes
        AnimationManager.instance = this;
    }

    addAnimation(animation) {
        this.animations.push(animation);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        requestAnimationFrame(this.update.bind(this));
    }

    update = (timestamp) => {
        if (!this.isRunning) return;

        // Process each animation
        this.animations.forEach(animation => {
            animation.update(timestamp, this.auStates);
        });

        // Reconcile and apply AU changes
        Object.entries(this.auStates).forEach(([au, {intensity, duration}]) => {
            this.facsLib.setAU(au, intensity, duration);
        });

        // Reset AU states for the next frame
        this.auStates = {};

        requestAnimationFrame(this.update);
    }

    stop() {
        this.isRunning = false;
    }

    // Reconciliation logic can be refined based on specific needs
    reconcileAUChanges() {
        // Placeholder for reconciliation logic
    }
}

export default AnimationManager;
