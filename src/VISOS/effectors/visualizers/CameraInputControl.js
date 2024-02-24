import CameraControl from './CameraControl.js';

class CameraInputControl extends CameraControl {
    constructor(engine) {
        super(engine);
        this.initMouseControls();
        this.initKeyboardControls();
    }

    initMouseControls() {
        document.addEventListener('wheel', this.handleMouseWheel.bind(this));
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));

        this.isDragging = false;
        this.shiftKey = false;
        this.prevX = 0;
        this.prevY = 0;
    }

    handleMouseWheel(event) {
        // Adjust the camera's forward/backward position based on the wheel delta
        const delta = event.deltaY * -0.05;
        this.dolly(delta);
    }

    handleMouseDown(event) {
        this.isDragging = true;
        this.shiftKey = event.shiftKey;
        this.prevX = event.clientX;
        this.prevY = event.clientY;
    }

    handleMouseMove(event) {
        if (this.isDragging) {
            const deltaX = event.clientX - this.prevX;
            const deltaY = event.clientY - this.prevY;
            this.prevX = event.clientX;
            this.prevY = event.clientY;

            if (this.shiftKey) {
                // Rotate camera with shift-drag
                this.rotate(deltaX, deltaY);
            } else {
                // Pan camera on drag without shift
                this.pan(deltaX * -0.01, deltaY * 0.01); // Adjust sensitivity as needed
            }
        }
    }

    handleMouseUp(event) {
        this.isDragging = false;
    }

    initKeyboardControls() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(event) {
        const moveSpeed = 0.5;
        const rotateSpeed = 5;
        switch (event.key) {
            case 'ArrowUp':
                this.dolly(-moveSpeed);
                break;
            case 'ArrowDown':
                this.dolly(moveSpeed);
                break;
            case 'ArrowLeft':
                this.rotate(-rotateSpeed, 0);
                break;
            case 'ArrowRight':
                this.rotate(rotateSpeed, 0);
                break;
            // Implement additional keys as needed
        }
    }

    dolly(delta) {
        this.distance += delta;
        this.updateCameraPosition();
    }

    rotate(deltaX, deltaY) {
        this.angleY += deltaX * 0.01; // Adjust sensitivity as needed
        this.angleX -= deltaY * 0.01; // Inverting deltaY for intuitive control
        this.updateCameraPosition();
    }

    pan(deltaX, deltaY) {
        // Calculate new target based on the pan delta
        // These calculations assume a simple 2D pan. For 3D scenes, you might need to adjust based on camera orientation
        this.target.x += deltaX;
        this.target.y += deltaY;
        this.updateCameraPosition();
    }
}

export default CameraInputControl;
