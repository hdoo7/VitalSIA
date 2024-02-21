import { loadUnityScript } from './unityScriptLoader.js';
import { EngineWebGL_u3d } from './facs/engineWebGL_u3d.js';
import { FacsLib } from './facs/facslib.js';
import { Mainframe } from '../mainframe/js/mainframe.classes.js';
let engine;
let facslib;
let unityWebGLContentLoaded = false;
let character = {
    id: "001_FEMALE_CAU",
    name: "Amy",
    img: "unity/img/001_FEMALE_CAU.PNG",
    path: "https://evalibre.blob.core.windows.net/evalibre/001_FEMALE_CAU_2019_05_06/",
    scene: "scene_001_FEMALE_CAU",
    voiceIndex: 5
};
window.U3_sceneLoaded = ()=>{
    if (!unityWebGLContentLoaded) {
        engine.getLocalCameraPosition();
        engine.getLocalEyeTargetPosition();
        facslib.updateEngine();
    }
}

window.U3_startSceneLoaded = () => {
    if (!unityWebGLContentLoaded) {
        facslib.load('scene_environment_simple', character.scene);
        unityWebGLContentLoaded = true;

            console.log("Prototype loaded");
            mainframe = new Mainframe('../mianframe/configs/eEvaConfig.xml');
            mainframe.run();
        
    }
}


// Function to initialize Unity game instance and related settings
function initializeUnityGame() {
    let gameInstance = UnityLoader.instantiate("gameContainer", character.path + "webgl.json");
    engine = new EngineWebGL_u3d(gameInstance);
    window.engine = engine;
    facslib = new FacsLib(engine);
    engine.FacsLib = facslib;
}


// Load the Unity loader script and initialize the Unity game instance once the script is loaded
loadUnityScript(character.path+"UnityLoader.js", initializeUnityGame);
