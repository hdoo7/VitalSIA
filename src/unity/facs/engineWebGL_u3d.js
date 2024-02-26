
import { unityBlendshapes, unityBoneshapes } from './shapeDict.js';

class EngineWebGL_u3d  {
    constructor(gameInstance) {

        this.gameInstance = gameInstance;
        this.unityBlendshapes = unityBlendshapes;
        this.unityBoneshapes = unityBoneshapes;

        this.weights = new Array(this.unityBlendshapes.length).fill(0);
        this.smoothTimes = new Array(this.unityBlendshapes.length).fill(0);

        this.boneWeights = new Array(this.unityBoneshapes.length).fill(0);
        this.boneSmoothTimes = new Array(this.unityBoneshapes.length).fill(0);

        this.cameraPosition = new Array(3).fill(0);
        this.viewportLookPoint = new Array(2).fill(0);
		
        this.FacsLib = null;
    }

    load(environmentSceneName, characterSceneName) {
        this.gameInstance.SendMessage('SceneLoader', 'Load', `${environmentSceneName};${characterSceneName}`);
    }

    setAU(auNumber, intensity, lorR) {
        this.gameInstance.SendMessage('FAC_controller', 'change', `${auNumber}:${intensity}`);
    }

    setTargets(targetWeights, smoothTimes) {
        // Blendshapes
        this.unityBlendshapes.forEach((blendshape, i) => {
            if (blendshape.AUid) {
                const AUIndex = this.FacsLib.ActionUnitsList.findIndex(elem => elem.id === blendshape.AUid);
                this.weights[i] = targetWeights[AUIndex];
                this.smoothTimes[i] = smoothTimes[AUIndex];
            } else if (blendshape.VisemeName) {
                const offset = this.FacsLib.ActionUnitsList.length;
                const VisemeIndex = this.FacsLib.VisemesList.findIndex(elem => elem.name === blendshape.VisemeName);
                this.weights[i] = targetWeights[VisemeIndex + offset];
                this.smoothTimes[i] = smoothTimes[VisemeIndex + offset];
            }
        });

        let params = this.weights.map((weight, i) => `${weight.toFixed(1)};${this.smoothTimes[i].toFixed(1)};`).join('');
        this.gameInstance.SendMessage('FACcontroler', 'SetAllTargetWeights', params);

        // Boneshapes
        this.unityBoneshapes.forEach((boneshape, i) => {
            if (boneshape.AUid) {
                const AUIndex = this.FacsLib.ActionUnitsList.findIndex(elem => elem.id === boneshape.AUid);
                this.boneWeights[i] = targetWeights[AUIndex];
                this.boneSmoothTimes[i] = smoothTimes[AUIndex];
            }
        });

        params = this.boneWeights.map((weight, i) => `${weight.toFixed(1)};${this.boneSmoothTimes[i].toFixed(1)};`).join('');
        this.gameInstance.SendMessage('FACcontroler', 'SetAllTargetBoneWeights', params);
    }

    setEyeTargetViewport(x, y, z) {
        const params = `${x.toFixed(2)};${y.toFixed(2)};${z.toFixed(2)};`;
        this.gameInstance.SendMessage('FACcontroler', 'SetEyeTargetViewport', params);
    }

    setEyeTarget(x, y, z, eyesWeight, eyesSmoothTime, headWeight, headSmoothTime, debugVisible) {
        const params = `${x.toFixed(2)};${y.toFixed(2)};${z.toFixed(2)};${eyesWeight.toFixed(2)};${eyesSmoothTime.toFixed(2)};${headWeight.toFixed(2)};${headSmoothTime.toFixed(2)};${debugVisible.toFixed(2)};`;
        this.gameInstance.SendMessage('FACcontroler', 'SetEyeTarget', params);
    }

    getEyeTargetPosition() {
        this.gameInstance.SendMessage('FACcontroler', 'GetEyeTargetPosition', '');
    }

    setCameraPosition(x, y, z, rx, ry, rz) {
        const params = `${x.toFixed(2)};${y.toFixed(2)};${z.toFixed(2)};${rx.toFixed(2)};${ry.toFixed(2)};${rz.toFixed(2)};`;
        this.gameInstance.SendMessage('FACcontroler', 'SetCameraPosition', params);
    }
	
	centerHeadPosition(x,y,z) {
		// This is to access the center of the head position of the character
		this.engine.centerHeadPosition[0] = x;
		this.engine.centerHeadPosition[1] = y;
		this,engine.centerHeadPosition[2] = z;
		//console.log("Call from Unity:"+x+", "+y+", "+z);
	}
}

// Export the class for use in other modules
export { EngineWebGL_u3d };
