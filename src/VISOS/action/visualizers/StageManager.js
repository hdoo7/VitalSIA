class StageManager extends KeyframeManager {
    constructor(facsLib, setAuStates, setAnimationState) {
        super(facsLib, setAuStates);
        this.setAnimationState = setAnimationState;
        this.stages = {};
        this.stageNames = [];
        this.currentStageIndex = -1;
        this.isPlaying = false;
        this.currentPlayTime = 0;
        this.playbackInterval = null;
    }

    addStage(name, keyframes = {}) {
        this.stages[name] = keyframes;
        this.stageNames = Object.keys(this.stages);
    }

    removeStage(name) {
        delete this.stages[name];
        this.stageNames = Object.keys(this.stages);
    }

    setStage(name) {
        const stageExists = this.stageNames.includes(name);
        if (!stageExists) return;

        this.currentStageIndex = this.stageNames.indexOf(name);
        this.keyframes = { ...this.stages[name] }; // Load keyframes for the current stage
        this.setAnimationState(state => ({
            ...state, 
            currentStage: name,
            currentTime: 0 // Reset current time for the new stage
        }));
    }

    nextStage() {
        if (this.currentStageIndex + 1 < this.stageNames.length) {
            const nextStageName = this.stageNames[this.currentStageIndex + 1];
            this.setStage(nextStageName);
            if (this.isPlaying) {
                this.play();
            }
        }
    }

    previousStage() {
        if (this.currentStageIndex > 0) {
            const prevStageName = this.stageNames[this.currentStageIndex - 1];
            this.setStage(prevStageName);
            if (this.isPlaying) {
                this.play();
            }
        }
    }

    play() {
        if (this.isPlaying || this.currentStageIndex === -1) return;
        
        this.isPlaying = true;
        this.currentPlayTime = 0; // Reset play time
        this.updatePlayTime();
        super.play(); // Start playing keyframes

        // Setup an interval to update play time in state
        this.playbackInterval = setInterval(() => {
            this.currentPlayTime += 100; // Increment play time
            this.setAnimationState(state => ({
                ...state,
                currentTime: this.currentPlayTime
            }));
        }, 100); // Update every 100 milliseconds

        // Determine when to proceed to the next stage based on the longest keyframe duration
        const longestDuration = this.calculateLongestDuration();
        setTimeout(() => {
            this.nextStage(); // Automatically advance to the next stage
        }, longestDuration);
    }

    pause() {
        if (!this.isPlaying) return;
        
        clearInterval(this.playbackInterval); // Stop the interval updating play time
        this.isPlaying = false;
        super.pause(); // Pause keyframe playback
    }

    calculateLongestDuration() {
        // Calculate the longest duration of all keyframes in the current stage
        let longestDuration = 0;
        Object.values(this.keyframes).forEach(keyframeSet => {
            keyframeSet.forEach(({ duration, delay }) => {
                longestDuration = Math.max(longestDuration, duration + delay);
            });
        });
        return longestDuration;
    }

    updatePlayTime() {
        // This method would update the current play time in the state, allowing UI components to reflect the progress
        this.setAnimationState(state => ({
            ...state,
            currentTime: this.currentPlayTime
        }));
    }
}
