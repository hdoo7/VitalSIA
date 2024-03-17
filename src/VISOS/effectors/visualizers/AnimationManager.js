import { ActionUnitsList } from '../../../unity/facs/shapeDict';

export default class AnimationManager {
  constructor(facsLib, setAuStates) {
    if (AnimationManager.instance) {
      return AnimationManager.instance;
    }
    this.facsLib = facsLib;
    this.setAuStates = setAuStates;
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
    this.facsLib.setTargetAU(AU.replace("AU", ""), targetIntensity, side, smoothTime);
    this.facsLib.updateEngine();
    
    // Update the component state with the adjusted AU information.
    this.setAuStates(prevAuStates => ({
      ...prevAuStates,
      [AU]: { ...prevAuStates[AU], intensity: targetIntensity, side, smoothTime, notes },
    }));
  }

  setFaceToNeutral(duration = 750) {
    // Set all AUs to neutral positions.
    ActionUnitsList.forEach((AU) => {
      this.scheduleChange(AU.id, 0, duration, 0, "");
    });
    this.facsLib.updateEngine();
  }

  applyChangesFromJson(auJson) {
    this.setFaceToNeutral(750)
    // Parse JSON data and apply each AU change, with intensity scaling.
    setTimeout(()=>{
    const auData = JSON.parse(auJson);
      auData.forEach(({ id, intensity, duration, explanation = "" }) => {
        // Intensity is scaled by 80 to adjust to the application's requirements.
        this.scheduleChange(id, intensity * 90, duration, 0, explanation);
      });
    }, 800)
  }
}
