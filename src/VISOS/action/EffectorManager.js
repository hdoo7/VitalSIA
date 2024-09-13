class EffectorManager {
    constructor() {
        this.actionQueue = [];
        this.isProcessing = false;
    }

    enqueueAction(action) {
        this.actionQueue.push(action);
        if (!this.isProcessing) {
            this.processNextAction();
        }
    }

    processNextAction() {
        if (this.actionQueue.length === 0) {
            this.isProcessing = false;
            return;
        }
        this.isProcessing = true;
        const nextAction = this.actionQueue.shift();
        nextAction().then(() => this.processNextAction());
    }
}
export default EffectorManager;