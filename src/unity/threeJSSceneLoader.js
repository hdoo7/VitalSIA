import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ThreeJSEngine } from './threeJSEngine.js';

function initializeThreeJSScene(environmentSceneUrl, characterSceneUrl) {
    const engine = new ThreeJSEngine();

    engine.load(environmentSceneUrl, characterSceneUrl);

    window.engine = engine;
    window.facslib = new FacsLib(engine);
    engine.FacsLib = window.facslib;

    const detail = { engine: window.engine, facslib: window.facslib };
    document.dispatchEvent(new CustomEvent('threeJSLoaded', { detail }));
}

export { initializeThreeJSScene };
