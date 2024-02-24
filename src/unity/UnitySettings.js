import { loadUnityScript } from './unityScriptLoader.js'
import { EngineWebGL_u3d } from './facs/engineWebGL_u3d.js'
import { FacsLib } from './facs/facslib.js';
// import { MainFrame } from '../mainframe/js/mainframe.classes.js';

import  AnimationManager  from '../VISOS/effectors/visualizers/AnimationManager.js'
import SpeachManager from '../VISOS/effectors/verbalizers/SpeachManager.js'
import { loadUnityScript } from './unityScriptLoader.js'
import { loopSmileAndFrown, smile, stickTongueOut, loopSmileAndStickTongueOut } from '../VISOS/effectors/visualizers/facialExpressions.js'
import { zoomCameraOnLoad } from '../VISOS/effectors/visualizers/zoomIn.js'
import CameraInputControl from '../VISOS/effectors/visualizers/CameraInputControl.js';

window.engine;
window.facslib;
window.animationManager;
window.speachManager;
window.unityWebGLContentLoaded = false;
let character = {
    id: "001_FEMALE_CAU",
    name: "Amy",
    img: "unity/img/001_FEMALE_CAU.PNG",
    path: "https://evalibre.blob.core.windows.net/evalibre/001_FEMALE_CAU_2019_05_06/",
    scene: "scene_001_FEMALE_CAU",
    voiceIndex: 5
};
window.requestAnimationFrame;
window.U3_sceneLoaded = ()=>{
    if (!unityWebGLContentLoaded) {
        console.log("Starting fear animation sequence...")    
        setTimeout(() => { 
            // loopSmileAndStickTongueOut(animationManager);
            // zoomCameraOnLoad(engine);
            // loopSmileAndFrown(animationManager)
            speachManager.enqueueText(`Welcome to Our 3D World!
            I'm here to guide you through navigating our beautiful scene. Let's get you moving around with ease. Here's how you can control the camera to explore:
            
            🖱️ Mouse Controls:
            Rotate View: Click and hold the left mouse button, then drag in any direction. This lets you look around. If you want to get a full 360-degree view, simply drag your mouse left or right while holding down the shift key. It's like turning your head to look around — easy, right?
            
            Move Forward/Backward: Use your mouse wheel to move closer to or further away from objects. Rolling the wheel up moves you forward, and rolling it down moves you back. Imagine it as walking through the scene.
            
            Pan View: To shift your view left, right, up, or down without changing where you're looking, click and hold the left mouse button without pressing shift, then drag your mouse. It's like sidestepping or ducking.
            
            ⌨ Keyboard Controls:
            Arrow Keys: Prefer keyboard shortcuts? You can also use the arrow keys to pan the camera. The up and down arrows move your view up and down, while the left and right arrows pan it left and right.
            
            Zoom with 'W' and 'S': Press 'W' to move closer to the scene or 'S' to move away. It's a simple way to zoom in and out.
            
            Rotate with 'A' and 'D': Use 'A' to rotate the view to the left and 'D' to rotate it to the right. It's like turning around to see what's behind you.
            
            Feel free to mix and match these controls to explore our world from every angle. Whether you're looking up at the sky, down at the ground, or around at the stunning scenery, I'm here to make sure you don't miss a thing. Enjoy your adventure!
            
            
            
            
            
            `)
            const cameraInputControl = new CameraInputControl(engine);
            document.getElementById("videoOverlay").classList.add("fade-out")
        }, 500) 
        window.unityWebGLContentLoaded = true;
    }
}

window.U3_startSceneLoaded = () => {
    console.log("Unity WebGL content loaded");

    if (!window.unityWebGLContentLoaded) {

        console.log("Unity WebGL content loaded!!!")
        facslib.load('scene_environment_simple', character.scene)
        
        
        
    
       
        console.log("Prototype loaded");
            // mainframe = new MainFrame('../mianframe/configs/eEvaConfig.xml');
            // mainframe.run();
    }
}


// Function to initialize Unity game instance and related settings
function initializeUnityGame() {
    window.gameInstance = UnityLoader.instantiate("gameContainer", character.path + "webgl.json")
    engine = new EngineWebGL_u3d(window.gameInstance)
    facslib = new FacsLib(engine)
    engine.FacsLib = facslib
    animationManager = new AnimationManager(facslib)
    speachManager = new SpeachManager(animationManager);
       
     
}


// Load the Unity loader script and initialize the Unity game instance once the script is loaded
loadUnityScript(character.path+"UnityLoader.js", initializeUnityGame)

