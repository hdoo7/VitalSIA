import { loadUnityScript } from './unityScriptLoader.js'
import { EngineWebGL_u3d } from './facs/engineWebGL_u3d.js'
import { FacsLib } from './facs/facslib.js';
// import { MainFrame } from '../mainframe/js/mainframe.classes.js';
import app from '../app.js'


window.engine;
window.facslib;

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
            app(engine, facslib)
            document.getElementById("videoOverlay").classList.add("fade-out")
        }, 50) 
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
    engine = new EngineWebGL_u3d(window.gameInstance);
    window.centerHeadPosition = engine.centerHeadPosition;
    facslib = new FacsLib(engine);
    engine.FacsLib = facslib;

       
     
}


// Load the Unity loader script and initialize the Unity game instance once the script is loaded
loadUnityScript(character.path+"UnityLoader.js", initializeUnityGame)

