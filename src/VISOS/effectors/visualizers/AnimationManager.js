import { ActionUnitsList, VisemesList } from '../unity/facs/shapeDict';

class AnimationManager {
    constructor(facslib, setAuStates, setVisemeStates) {
        this.facsLib = facslib;
        this.setAuStates = setAuStates;
        this.setVisemeStates = setVisemeStates;
    }

    setFaceToNeutral(duration) {
        this.facsLib.resetAllTargets(duration);
        this.facsLib.updateEngine();
        this.setAuStates(ActionUnitsList.reduce((acc, au) => ({
            ...acc, [au.id]: { intensity: 0, name: au.name, notes: "" },
        }), {}));
        this.setVisemeStates(VisemesList.reduce((acc, viseme) => ({
            ...acc, [viseme.id]: { intensity: 0, name: viseme.name, notes: "" },
        }), {}));
    }

    updateViseme(visemeId, intensity, duration) {
        this.facsLib.setTargetViseme(visemeId, intensity, duration);
        this.facsLib.updateEngine();
    }
}

export default AnimationManager;

    
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
