

import { zoomCameraOnLoad } from './VISOS/effectors/visualizers/zoomIn.js'
import CameraInputControl from './VISOS/effectors/visualizers/CameraInputControl.js';
import CameraControl from './VISOS/effectors/visualizers/CameraControl.js';

const useCamera = (engine, animationManager) => {
    

    // zoomCameraOnLoad(engine);
    const cameraControl = new CameraControl(engine, 0.27, 1.59, -0.20, 0.07, 0);

    const targetPosition = { x: 0.27, y: 1.59, z: -8.88 };
    const targetRotation = { x: 0.07, y: 0.00 };
    const targetDistance = 10; // Adjust this value based on your desired zoom level

    cameraControl.animateTo(targetPosition, targetRotation, targetDistance, 3000);

    const cameraInputControl = new CameraInputControl(cameraControl);
}
export default useCamera;