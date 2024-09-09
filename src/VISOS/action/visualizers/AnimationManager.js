import { ActionUnitsList, VisemesList } from '../../../unity/facs/shapeDict';

export default class AnimationManager {
    constructor(facsLib, setAuStates, setVisemeStates) {
        if (AnimationManager.instance) {
            return AnimationManager.instance;
        }
        this.facsLib = facsLib;
        this.setAuStates = setAuStates;
        this.setVisemeStates = setVisemeStates;
        AnimationManager.instance = this;

        this.currentIntensity = ActionUnitsList.reduce((acc, au) => ({
            ...acc,
            [au.id]: 0
        }), {});
    }

    scheduleChange(au, intensity, duration, delay = 0, notes = "") {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Direct application of intensity adjustment, factoring in the custom scaling.
                this.applyAUChange(au, intensity, duration, 'both', 0.5, notes);
                setTimeout(() => resolve(), duration + delay);
            }, delay);
        });
    }

    applyAUChange(AU, targetIntensity, duration, side = 'both', smoothTime = 0.5, notes = "") {
        // Apply change directly to Unity
        this.facsLib.setTargetAU(AU.replace("AU", ""), Math.abs(Number(targetIntensity)), "l", smoothTime);
        this.facsLib.updateEngine();
        
        // Update the component state with the adjusted AU information.
        this.setAuStates(prevAuStates => ({
            ...prevAuStates,
            [AU]: { ...prevAuStates[AU], intensity: targetIntensity, side, smoothTime, notes },
        }));
    }

    scheduleVisemeChange(visemeId, intensity, duration, delay = 0) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.applyVisemeChange(visemeId, intensity, duration);
                setTimeout(() => resolve(), duration + delay);
            }, delay);
        });
    }

    applyVisemeChange(visemeId, intensity, duration) {
        console.log(`Applying viseme change: ${visemeId} at ${intensity}% intensity for ${duration}ms.`);
        this.facsLib.setTargetViseme(visemeId, intensity, duration);
        this.facsLib.updateEngine();
        this.setVisemeStates(prevVisemeStates => ({
            ...prevVisemeStates,
            [visemeId]: { ...prevVisemeStates[visemeId], intensity }
        }));
    }

    setFaceToNeutral(duration = 750) {
        // Set all AUs to neutral positions.
        ActionUnitsList.forEach((AU) => {
            this.scheduleChange(AU.id, 0, duration, 0, "");
        });
        // Set all visemes to neutral positions.
        VisemesList.forEach((viseme) => {
            this.scheduleVisemeChange(viseme.id, 0, duration);
        });
        this.facsLib.updateEngine();
    }

    setVisemeToNeutral() {
        this.facsLib.setNeutralViseme()
    }

    applyChangesFromJson(auJson) {
        this.setFaceToNeutral(750);
        // Parse JSON data and apply each AU change, with intensity scaling.
        setTimeout(() => {
            const auData = JSON.parse(auJson);
            auData.forEach(({ id, intensity, duration, explanation = "" }) => {
                // Intensity is scaled by 80 to adjust to the application's requirements.
                this.scheduleChange(id, intensity * 90, duration, 0, explanation);
            });
        }, 800);
    }
}