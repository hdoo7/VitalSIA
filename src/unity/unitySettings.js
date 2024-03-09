import { loadUnityScript } from './unityScriptLoader.js'
import { EngineWebGL_u3d } from './facs/engineWebGL_u3d.js'
import { FacsLib } from './facs/facslib.js';

// import { MainFrame } from '../mainframe/js/mainframe.classes.js';


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

window.U3_sceneLoaded = ()=>{
    if (!unityWebGLContentLoaded) {

        window.unityWebGLContentLoaded = true;

       setTimeout(() => {
            console.log("Unity WebGL content loaded!!!")
        const detail = { engine: window.engine, facslib: window.facslib };
        document.dispatchEvent(new CustomEvent('unityLoaded', { detail }));

    }, 100);
    }
}

window.U3_startSceneLoaded = () => {
    console.log("Unity WebGL content loaded");

    if (!window.unityWebGLContentLoaded) {

        console.log("Unity WebGL content loaded!!!")
        facslib.load('scene_environment_simple', character.scene)
        

    }
}


// Function to initialize Unity game instance and related settings
function initializeUnityGame() {
    window.gameInstance = UnityLoader.instantiate("gameContainer", character.path + "webgl.json")
    window.engine = new EngineWebGL_u3d(window.gameInstance);
    window.facslib = new FacsLib(engine);
    window.engine.FacsLib = facslib;

       
     
}


// Load the Unity loader script and initialize the Unity game instance once the script is loaded
loadUnityScript(character.path+"UnityLoader.js", initializeUnityGame)
