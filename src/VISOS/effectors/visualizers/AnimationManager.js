export default class AnimationManager {
    constructor(facsLib, setAuStates) {
      if (AnimationManager.instance) {
        return AnimationManager.instance;
      }
      this.facsLib = facsLib;
      this.setAuStates = setAuStates; // Function to update AU states
      AnimationManager.instance = this;
    }
  
    // Schedule a change for an AU with a specified intensity, duration, and optional delay
    scheduleChange(au, intensity, duration, delay = 0) {
      setTimeout(() => {
        this.applyAUChange(au, intensity, duration);
      }, delay);
    }
  
    // Apply an AU change directly to Unity and update the state to reflect this change
    applyAUChange(AU, targetIntensity, duration, side = 'both', smoothTime = 0.5) {
      // Immediately apply change to Unity
      this.facsLib.setTargetAU(AU.replace("AU", ""), targetIntensity, side, smoothTime);
      this.facsLib.updateEngine();
  
      // Update React state to reflect the change
      this.setAuStates(prevAuStates => ({
        ...prevAuStates,
        [AU]: { ...prevAuStates[AU], intensity: targetIntensity, side, smoothTime },
      }));
    }
  
    // Set all AUs to neutral using scheduleChange to gradually apply these changes
    setFaceToNeutral(duration = 750) {
      Object.keys(this.currentIntensity).forEach(AU => {
        this.scheduleChange(AU, 0, duration);
      });
    }
  
    // Apply changes from a provided JSON object, leveraging scheduleChange for each AU
    applyChangesFromJson(auJson) {
      const auData = JSON.parse(auJson);
      auData.forEach(({ au, intensity, duration, delay = 0 }) => {
        this.scheduleChange(au.replace("AU", ""), intensity, duration, delay);
      });
    }
  }
  