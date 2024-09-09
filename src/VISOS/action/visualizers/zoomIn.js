export function zoomCameraOnLoad(engine) {
    console.log("Setting initial camera position and starting rotation...");

    // Initial guess for camera position
    const posX = 0; // Centered on the X-axis
    const posY = 1; // Slightly elevated above the ground
    const posZ = -3000; // Positioned away from the origin along the Z-axis to view the scene

    // Initial guess for camera rotation to look straight ahead
    const rotationX = 0; // Level on the X-axis (no tilt)
    const rotationY = 0; // Centered on the Y-axis (facing towards the origin)
    const rotationZ = 0; // Stable on the Z-axis (no roll)

    // Set the camera to the guessed initial position and rotation
    engine.setCameraPosition(posX, posY, posZ, rotationX, rotationY, rotationZ);

    // Optionally, start a rotation around the Y-axis to rotate the camera 360 degrees
    startRotation(engine);
}

function startRotation(engine) {
    let currentRotationY = 0;
    const rotationStep = 1; // Degrees to rotate each step
    const intervalTime = 100; // Milliseconds between each rotation step

    const rotationInterval = setInterval(() => {
        currentRotationY = (currentRotationY + rotationStep) % 360; // Loop back to 0 after 360
        // Update the camera's Y rotation while keeping other positions and rotations constant
        engine.setCameraPosition(0, 1, -10, 0, currentRotationY, 0);

        console.log(`Rotating camera: ry=${currentRotationY}`);
    }, intervalTime);
}

