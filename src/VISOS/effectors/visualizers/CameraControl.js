class CameraControl {
    constructor(engine, startX = 0, startY = 0, startZ = 10, startAngleX = 0, startAngleY = 0) {
        this.engine = engine;
        this.target = { x: startX, y: startY, z: 0 }; // Initial target point to rotate around
        this.distance = startZ; // Initial distance from the target point
        this.angleX = startAngleX; // Initial rotation angle around the X-axis
        this.angleY = startAngleY; // Initial rotation angle around the Y-axis
        this.observers = []; // Add an array to hold observers

        this.updateCameraPosition();
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => observer.update());
    }

    setTarget(x, y, z) {
        this.target.x = x;
        this.target.y = y;
        this.target.z = z;
        this.updateCameraPosition();
    }

    zoom(delta) {
        this.distance += delta;
        this.updateCameraPosition();
    }

    pan(deltaX, deltaY) {
        this.target.x += deltaX;
        this.target.y += deltaY;
        this.updateCameraPosition();
    }

    rotate(deltaX, deltaY) {
        this.angleX += deltaX;
        this.angleY += deltaY;
        this.updateCameraPosition();
    }

    animateTo(targetPosition, targetRotation, targetDistance, duration = 1000) {
        const startTime = performance.now();
        const startTarget = { ...this.target };
        const startDistance = this.distance;
        const startRotation = { x: this.angleX, y: this.angleY };

        const update = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const fraction = Math.min(elapsedTime / duration, 1); // Ensure fraction doesn't exceed 1

            this.target.x = startTarget.x + (targetPosition.x - startTarget.x) * fraction;
            this.target.y = startTarget.y + (targetPosition.y - startTarget.y) * fraction;
            this.target.z = startTarget.z + (targetPosition.z - startTarget.z) * fraction;
            this.distance = startDistance + (targetDistance - startDistance) * fraction;
            this.angleX = startRotation.x + (targetRotation.x - startRotation.x) * fraction;
            this.angleY = startRotation.y + (targetRotation.y - startRotation.y) * fraction;

            this.updateCameraPosition();

            if (fraction < 1) {
                requestAnimationFrame(update);
            } else {
                console.log("Camera animation complete.");
            }
        };

        requestAnimationFrame(update);
    }

    updateCameraPosition() {
        let radX = this.angleX * (Math.PI / 180);
        let radY = this.angleY * (Math.PI / 180);

        let posX = this.target.x + this.distance * Math.sin(radY) * Math.cos(radX);
        let posY = this.target.y + this.distance * Math.sin(radX);
        let posZ = this.target.z + this.distance * Math.cos(radY) * Math.cos(radX);

        this.engine.setCameraPosition(posX, posY, posZ, this.angleX, this.angleY, 0);

        // console.log(`Camera Position: (${posX.toFixed(2)}, ${posY.toFixed(2)}, ${posZ.toFixed(2)})`);
        // console.log(`Camera Rotation: (${this.angleX.toFixed(2)}, ${this.angleY.toFixed(2)})`);

        // Notify observers after updating the camera position
        this.notifyObservers();
    }
}

export default CameraControl;
