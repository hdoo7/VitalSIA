class CameraControl {
    constructor(engine) {
        this.engine = engine;
        this.target = { x: 0, y: 0, z: 0 }; // Target point to rotate around
        this.distance = 10; // Distance from the target point
        this.angleX = 0; // Rotation angle around the X-axis
        this.angleY = 0; // Rotation angle around the Y-axis
    }

    // Sets the camera's target point
    setTarget(x, y, z) {
        this.target.x = x;
        this.target.y = y;
        this.target.z = z;
        this.updateCameraPosition();
    }

    // Zooms the camera in or out
    zoom(delta) {
        this.distance += delta;
        this.updateCameraPosition();
    }

    // Pans the camera horizontally and vertically
    pan(deltaX, deltaY) {
        this.target.x += deltaX;
        this.target.y += deltaY;
        this.updateCameraPosition();
    }

    // Rotates the camera around the target point
    rotate(deltaX, deltaY) {
        this.angleX += deltaX;
        this.angleY += deltaY;
        this.updateCameraPosition();
    }

    // Calculates and updates the camera's position based on current parameters
    updateCameraPosition() {
        // Convert angles from degrees to radians for calculations
        let radX = this.angleX * (Math.PI / 180);
        let radY = this.angleY * (Math.PI / 180);

        // Calculate the camera's position using spherical coordinates
        let posX = this.target.x + this.distance * Math.sin(radY) * Math.cos(radX);
        let posY = this.target.y + this.distance * Math.sin(radX);
        let posZ = this.target.z + this.distance * Math.cos(radY) * Math.cos(radX);

        // Assuming the engine's setCameraPosition method takes position (x, y, z) and rotation (rx, ry, rz)
        // Here, we're not modifying the camera's rotation based on the control inputs
        this.engine.setCameraPosition(posX, posY, posZ, 0, 0, 0);
    }
}

export default CameraControl;
