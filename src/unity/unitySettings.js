import './unityScriptLoader'; // Correctly import unityScriptLoader
import { UnityLoadProvider } from './unityMiddleware'; // Import UnityLoadProvider

// Unity game configuration
const gameConfig = {
  dataUrl: "Build/game.data",
  frameworkUrl: "Build/game.framework.js",
  codeUrl: "Build/game.wasm",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "MyCompany",
  productName: "MyProduct",
  productVersion: "1.0",
};

// Load the Unity game
const loadUnityGame = () => {
  const unityInstance = UnityLoader.instantiate("unityContainer", "Build/unity.json", gameConfig);
  unityInstance.then(instance => {
    // Unity game instance is ready
    window.UnityInstance = instance;
    // Dispatch event to signal Unity game is loaded
    window.dispatchEvent(new CustomEvent('unityGameLoaded'));
  }).catch(error => {
    console.error("Unity game failed to load", error);
  });
};

// Listen for the Unity game loaded event and call handleUnityLoaded
window.addEventListener('unityGameLoaded', () => {
  UnityLoadProvider.handleUnityLoaded();
});

export { loadUnityGame };

});

export { loadUnityGame };

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

