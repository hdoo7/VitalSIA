export function zoomCameraOnLoad(engine) {
    // Initial camera position (further away)
    const startX = 0;
    const startY = 0;
    const startZ = -10; // Assuming negative Z is away from the scene

    // Target camera position (closer to the scene)
    const targetX = 0;
    const targetY = 0;
    const targetZ = -5;

    // Camera rotation (adjust as needed)
    const rotationX = 0;
    const rotationY = 0;
    const rotationZ = 110;

    // Set the camera to the initial position
    engine.setCameraPosition(startX, startY, startZ, rotationX, rotationY, rotationZ);

    // Assuming you have a mechanism to wait or interpolate, set the camera to the target position
    // For an immediate effect on load, you might directly set it to the target position
    engine.setCameraPosition(targetX, targetY, targetZ, rotationX, rotationY, rotationZ);
}
