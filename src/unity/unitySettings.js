import { loadUnityScript } from './unityScriptLoader.js';
import { EngineWebGL_u3d } from './facs/engineWebGL_u3d.js';
import { FacsLib } from './facs/facslib.js';
// Removed direct import of app to use middleware instead

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

// Updated event handling to use unityMiddleware
window.U3_sceneLoaded = () => {
    if (!window.unityWebGLContentLoaded) {
        console.log("Unity WebGL content loaded");
        window.dispatchEvent(new Event('unityLoaded'));
        window.unityWebGLContentLoaded = true;
    }
};

window.U3_startSceneLoaded = () => {
    console.log("Unity WebGL content started loading");
    if (!window.unityWebGLContentLoaded) {
        console.log("Unity WebGL content is now fully loaded!");
        facslib.load('scene_environment_simple', character.scene);
        console.log("Prototype loaded");
    }
};

function initializeUnityGame() {
    window.gameInstance = UnityLoader.instantiate("gameContainer", character.path + "webgl.json", {onProgress: UnityProgress});
    engine = new EngineWebGL_u3d(window.gameInstance);
    facslib = new FacsLib(engine);
    engine.FacsLib = facslib;
}

loadUnityScript(character.path+"UnityLoader.js", initializeUnityGame);

// Function to initialize Unity game instance and related settings
function initializeUnityGame() {
    window.gameInstance = UnityLoader.instantiate("gameContainer", character.path + "webgl.json", {onProgress: UnityProgress});
    engine = new EngineWebGL_u3d(window.gameInstance);
    facslib = new FacsLib(engine);
    engine.FacsLib = facslib;
}

// Load the Unity loader script and initialize the Unity game instance once the script is loaded
loadUnityScript(character.path+"UnityLoader.js", initializeUnityGame)

     
}


// Load the Unity loader script and initialize the Unity game instance once the script is loaded
loadUnityScript(character.path+"UnityLoader.js", initializeUnityGame)

