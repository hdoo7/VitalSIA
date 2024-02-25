import { loadUnityScript } from './unityScriptLoader.js'
import { EngineWebGL_u3d } from './facs/engineWebGL_u3d.js'
import { FacsLib } from './facs/facslib.js';
// import { MainFrame } from '../mainframe/js/mainframe.classes.js';

import  AnimationManager  from '../VISOS/effectors/visualizers/AnimationManager.js'
import SpeachManager from '../VISOS/effectors/verbalizers/SpeachManager.js'
import { loadUnityScript } from './unityScriptLoader.js'
import { loopSmileAndFrown, smile, stickTongueOut } from '../VISOS/effectors/visualizers/facialExpressions.js'
import { zoomCameraOnLoad } from '../VISOS/effectors/visualizers/zoomIn.js'
import CameraInputControl from '../VISOS/effectors/visualizers/CameraInputControl.js';
import { startComplexEmotion } from '../VISOS/effectors/visualizers/complexEmotion.js';

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
            // zoomCameraOnLoad(engine);
            // loopSmileAndFrown(animationManager)
            
            // speachManager.enqueueText(`Welcome to Our 3D World!
            // I'm here to guide you through navigating our beautiful scene. Let's get you moving around with ease. Here's how you can control the camera to explore:
            // `)
            // const cameraInputControl = new CameraInputControl(engine);
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

