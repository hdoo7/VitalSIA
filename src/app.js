import  AnimationManager  from './VISOS/effectors/visualizers/AnimationManager.js'
import SpeachManager from './VISOS/effectors/verbalizers/SpeachManager.js'
import { loopSmileAndFrown, smile, stickTongueOut } from './VISOS/effectors/visualizers/facialExpressions.js'
import { zoomCameraOnLoad } from './VISOS/effectors/visualizers/zoomIn.js'
import CameraInputControl from './VISOS/effectors/visualizers/CameraInputControl.js';
import { startComplexEmotion } from './VISOS/effectors/visualizers/complexEmotion.js';

export default app = (engine, faclib) => {
    const animationManager = new AnimationManager(facslib)
    const speachManager = new SpeachManager(animationManager);
            // zoomCameraOnLoad(engine);
            loopSmileAndFrown(animationManager)
            
            // speachManager.enqueueText(`Welcome to Our 3D World!
            // I'm here to guide you through navigating our beautiful scene. Let's get you moving around with ease. Here's how you can control the camera to explore:
            // `)
            // const cameraInputControl = new CameraInputControl(engine);
}