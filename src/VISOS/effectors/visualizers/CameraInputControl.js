class CameraInputControl {
    constructor(cameraControl) {
        this.cameraControl = cameraControl;
        this.initMouseControls();
        this.initKeyboardControls();
    }

    initMouseControls() {
        document.addEventListener('wheel', (event) => this.handleMouseWheel(event));
        document.addEventListener('mousedown', (event) => this.handleMouseDown(event));
        document.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        document.addEventListener('mouseup', () => this.handleMouseUp());

        this.isDragging = false;
        this.prevX = 0;
        this.prevY = 0;
    }

    handleMouseWheel(event) {
        const delta = event.deltaY * -0.05;
        this.cameraControl.zoom(delta);
    }

    handleMouseDown(event) {
        this.isDragging = true;
        this.prevX = event.clientX;
        this.prevY = event.clientY;
        this.ctrlKey = event.ctrlKey; // Track the Ctrl key state
    }

    handleMouseMove(event) {
        if (!this.isDragging) return;
        const deltaX = event.clientX - this.prevX;
        const deltaY = event.clientY - this.prevY;
        this.prevX = event.clientX;
        this.prevY = event.clientY;

        // Check if the Ctrl key is pressed for wider rotation
        const isWiderRotation = event.ctrlKey;
        let rotationAmplifier = 1;
        if (isWiderRotation) {
            rotationAmplifier = 5; // Adjust this value to control the wideness
        }

        if (event.shiftKey) {
            // Apply the rotationAmplifier for wider or normal rotation
            this.cameraControl.rotate(deltaX * rotationAmplifier, deltaY * rotationAmplifier);
        } else {
            // Pan camera on drag without shift
            this.cameraControl.pan(deltaX * -0.01, deltaY * 0.01); // Adjust sensitivity as needed
        }
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    initKeyboardControls() {
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    }

    handleKeyDown(event) {
        const moveSpeed = 0.5;
        const rotateSpeed = 5;
        switch (event.key) {
            case 'ArrowUp':
                this.cameraControl.dolly(-moveSpeed);
                break;
            case 'ArrowDown':
                this.cameraControl.dolly(moveSpeed);
                break;
            case 'ArrowLeft':
                this.cameraControl.rotate(-rotateSpeed, 0);
                break;
            case 'ArrowRight':
                this.cameraControl.rotate(rotateSpeed, 0);
                break;
            // Implement additional keys as needed
        }
    }
}

export default CameraInputControl;