import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class ThreeJSEngine {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.loader = new GLTFLoader();
        this.mixer = null;
        this.clock = new THREE.Clock();

        this.weights = [];
        this.smoothTimes = [];
        this.boneWeights = [];
        this.boneSmoothTimes = [];
        this.cameraPosition = new Array(3).fill(0);
        this.viewportLookPoint = new Array(2).fill(0);

        this.FacsLib = null;
        this.morphTargetInfluences = [];
        this.blendshapeMapping = {};
    }

    load(environmentSceneUrl, characterSceneUrl) {
        this.loader.load(environmentSceneUrl, (gltf) => {
            this.scene.add(gltf.scene);
            this.animate();
        });

        this.loader.load(characterSceneUrl, (gltf) => {
            this.character = gltf.scene;
            this.mixer = new THREE.AnimationMixer(this.character);
            this.scene.add(this.character);

            this.character.traverse((object) => {
                if (object.isMesh) {
                    this.morphTargetInfluences = object.morphTargetInfluences;
                    this.extractBlendshapes(object);
                }
            });
        });
    }

    extractBlendshapes(mesh) {
        if (mesh.morphTargetDictionary) {
            Object.entries(mesh.morphTargetDictionary).forEach(([name, index]) => {
                this.blendshapeMapping[name] = index;
            });
            console.log('Extracted Blendshapes:', this.blendshapeMapping);
        }
    }

    setAU(auNumber, intensity, lorR) {
        if (this.morphTargetInfluences) {
            const morphIndex = this.getMorphTargetIndex(auNumber);
            if (morphIndex !== -1) {
                this.morphTargetInfluences[morphIndex] = intensity / 100;
            }
        }
    }

    getMorphTargetIndex(auNumber) {
        // Mapping AU numbers to morph target indices
        const auToMorphMap = {
            "1": 0, "2": 1, "2R": 1, "2L": 1, "4": 2, "5": 3, "6": 4, "7": 5, "8": 6,
            // Add the remaining mappings based on the extracted blendshapes
        };
        return auToMorphMap[auNumber] || -1;
    }

    setTargets(targetWeights, smoothTimes) {
        targetWeights.forEach((weight, index) => {
            const morphIndex = this.getMorphTargetIndex(index);
            if (morphIndex !== -1) {
                this.morphTargetInfluences[morphIndex] = weight / 100;
            }
        });
    }

    setEyeTargetViewport(x, y, z) {
        this.camera.position.set(x, y, z);
    }

    setEyeTarget(x, y, z, eyesWeight, eyesSmoothTime, headWeight, headSmoothTime, debugVisible) {
        this.camera.position.set(x, y, z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    getEyeTargetPosition() {
        return this.camera.position;
    }

    setCameraPosition(x, y, z, rx, ry, rz) {
        this.camera.position.set(x, y, z);
        this.camera.rotation.set(rx, ry, rz);
        engineState.cameraPosition = { x, y, z, rx, ry, rz };
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        const delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta);
        this.renderer.render(this.scene, this.camera);
    }
}

export { ThreeJSEngine };

