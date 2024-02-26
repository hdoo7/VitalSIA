import  AnimationManager  from './VISOS/effectors/visualizers/AnimationManager.js'
import SpeachManager from './VISOS/effectors/verbalizers/SpeachManager.js'
import { loopSmileAndStickTongueOut, smile, stickTongueOut } from './VISOS/effectors/visualizers/facialExpressions.js'
import { zoomCameraOnLoad } from './VISOS/effectors/visualizers/zoomIn.js'
import CameraInputControl from './VISOS/effectors/visualizers/CameraInputControl.js';
import CameraControl from './VISOS/effectors/visualizers/CameraControl.js';
import { startComplexEmotion } from './VISOS/effectors/visualizers/complexEmotion.js';
import CharacterLookAtControl from './VISOS/effectors/visualizers/lookAtCharacterControl.js';

export default app = (engine, faclib) => {
    const animationManager = new AnimationManager(facslib)
    const speachManager = new SpeachManager(animationManager);
            // zoomCameraOnLoad(engine);
            loopSmileAndStickTongueOut(animationManager)
            const cameraControl = new CameraControl(engine, 0.27, 1.59, -0.20, 0.07, 0);

            const targetPosition = { x: 0.27, y: 1.59, z: -8.88 };
            const targetRotation = { x: 0.07, y: 0.00 };
            const targetDistance = 10; // Adjust this value based on your desired zoom level
            const characterLookAtControl = new CharacterLookAtControl(cameraControl, animationManager);

            cameraControl.animateTo(targetPosition, targetRotation, targetDistance, 3000);
            speachManager.enqueueText(`Welcome to Our 3D World!
            I'm here to guide you through navigating our beautiful scene. Let's get you moving around with ease. Here's how you can control the camera to explore:
            `)
            const cameraInputControl = new CameraInputControl(cameraControl);
}