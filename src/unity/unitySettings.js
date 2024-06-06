import { loadUnityScript } from './unityScriptLoader.js';
import { EngineWebGL_u3d } from './facs/engineWebGL_u3d.js';
import { FacsLib } from './facs/facslib.js';

// Assuming other imports are here if needed

window.engine;
window.facslib;

window.unityWebGLContentLoaded = false;
let character = {
    id: "018_MALE_AA",
    name: "Amy",
    img: "unity/img/001_FEMALE_CAU.PNG",
    // path: "https://evalibre.blob.core.windows.net/evalibre/",
    path: process.env.PUBLIC_URL + "/unitywasm/Build/",
    scene: "scene_001_FEMALE_CAU",
    voiceIndex: 5
};

window.U3_sceneLoaded = () => {
    if (!unityWebGLContentLoaded) {
        window.unityWebGLContentLoaded = true;

        setTimeout(() => {
            console.log("Unity WebGL content loaded!!!");
            adjustCanvasOnLayoutChange(); // Adjust the canvas size as part of the scene loading process
            
            const detail = { engine: window.engine, facslib: window.facslib };
            document.dispatchEvent(new CustomEvent('unityLoaded', { detail }));
            setTimeout(adjustCanvasOnLayoutChange, 50);
        }, 100);
    }
}

window.U3_startSceneLoaded = () => {
    console.log("Unity WebGL content loaded");

    if (!window.unityWebGLContentLoaded) {
        console.log("Unity WebGL content loaded!!!");
        facslib.load('scene_environment_simple', character.scene);
         // Adjust the canvas size as part of the start scene loading process
    }
}

// Function to adjust the canvas size
function adjustCanvasOnLayoutChange() {
    const canvas = document.getElementById('#canvas');
    if (canvas) {
        // Apply the dynamic resizing logic here
        canvas.style.width = '100%';
        canvas.style.height = '100%'; // Adjust based on your layout needs

        // If you have additional logic for observing attribute changes or maintaining aspect ratio, include it here
    }
}

// Function to initialize Unity game instance and related settings
function initializeUnityGame() {
    createUnityInstance(document.querySelector("#gameContainer"), {
        dataUrl: character.path + "unitywasm.data",
        frameworkUrl: character.path + "unitywasm.framework.js",
        codeUrl: character.path + "unitywasm.wasm",
    }).then((unityInstance) => {
        window.engine = new EngineWebGL_u3d(unityInstance);
        window.facslib = new FacsLib(window.engine);
        window.engine.FacsLib = window.facslib;
    }).catch((message) => {
        console.log(message);
    });
}

// Load the Unity loader script and initialize the Unity game instance once the script is loaded
loadUnityScript(`${character.path}unitywasm.loader.js`, initializeUnityGame);
