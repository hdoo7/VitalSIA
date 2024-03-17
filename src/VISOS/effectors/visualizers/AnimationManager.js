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

  scheduleChange(au, intensity, duration, delay=0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.applyAUChange(au, intensity, duration);
        setTimeout(() => resolve(), duration + delay);
      }, delay);
    });
  }

  applyAUChange(AU, targetIntensity, duration, side = 'both', smoothTime = 0.5) {
    // Directly apply change to Unity and update the state without gradual mechanism here
    this.facsLib.setTargetAU(AU.replace("AU", ""), targetIntensity, side, smoothTime);
    this.facsLib.updateEngine();
    
    // Update the state immediately with the target intensity
    this.setAuStates(prevAuStates => ({
      ...prevAuStates,
      [AU]: { ...prevAuStates[AU], intensity: targetIntensity, side, smoothTime },
    }));
  }

  setFaceToNeutral(duration = 750) {
    ActionUnitsList.forEach((AU) => this.scheduleChange(AU.id, 0, duration, 0));
    this.facsLib.updateEngine();
  }

  applyChangesFromJson(auJson) {
    // Directly call scheduleChange for each AU in the JSON, without setting to neutral first
    // as scheduleChange will handle gradual updates.

    const auData = JSON.parse(auJson);
    auData.forEach(({ au, intensity, duration }) => {
        this.scheduleChange(au.replace("AU", ""), intensity * 80, duration, 0);
    });
  }
}
