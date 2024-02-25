class CharacterLookAtControl {
    constructor(cameraControl, animationManager) {

        this.cameraControl = cameraControl;
        this.animationManager = animationManager;

        this.cameraControl.addObserver(this);
    }

    update() {
        const cameraPosition = this.cameraControl.target;
        const characterPosition =   {x:0, y:0, z:0};

        // Calculate horizontal and vertical direction from character to camera
        const direction = {
            x: cameraPosition.x - characterPosition.x,
            y: cameraPosition.y - characterPosition.y,
            z: cameraPosition.z - characterPosition.z
        };

        this.applyHeadAndEyeAUs(direction);
    }

    applyHeadAndEyeAUs(direction) {
        // Calculate horizontal angle (left/right)
        const horizontalAngle = Math.atan2(direction.x, direction.z) * (180 / Math.PI);
        const horizontalIntensity = Math.abs(horizontalAngle); // Simplified calculation

        // Calculate vertical angle (up/down)
        const distance = Math.sqrt(direction.x ** 2 + direction.z ** 2);
        const verticalAngle = Math.atan2(direction.y, distance) * (180 / Math.PI);
        const verticalIntensity = Math.abs(verticalAngle); // Simplified calculation

        // Assuming AUs for horizontal and vertical movements
        // Placeholder AUs: AU51 (head turn), AU54 (head up/down), AU61 (eyes turn), AU64 (eyes up/down)
        // Adjust AU numbers and intensity calculations based on your animation system
        this.animationManager.scheduleChange('AU51', horizontalIntensity*22, 500, 0); // Head turn
        this.animationManager.scheduleChange('AU54', verticalIntensity*22, 500, 0); // Head up/down
        this.animationManager.scheduleChange('AU61', horizontalIntensity, 500, 0); // Eyes turn
        this.animationManager.scheduleChange('AU64', verticalIntensity, 500, 0); // Eyes up/down
    }
}
export default CharacterLookAtControl;