import { ActionUnitsList, EmotionsList, VisemesList } from './shapeDict.js';

class FacsLib {
  constructor(engine) {
    this.defaultIntensity = 'C';
    this.engine = engine;
    this.ActionUnitsList = ActionUnitsList;
    this.EmotionsList = EmotionsList;
    this.VisemesList = VisemesList;
    this.nbActionUnits = this.ActionUnitsList.length;
    this.nbVisemes = this.VisemesList.length;
    this.currentWeightTargets = new Array(this.nbActionUnits + this.nbVisemes).fill(0);
    this.currentWeightSmooth = new Array(this.nbActionUnits + this.nbVisemes).fill(0);
    this.cameraPosition = new Array(3).fill(0);
  }

  load(environmentSceneName, characterSceneName) {
    this.engine.load(environmentSceneName, characterSceneName);
  }

  setNeutral(smoothTime) {
    this.currentWeightTargets.fill(0, 0, this.nbActionUnits);
    this.currentWeightSmooth.fill(smoothTime, 0, this.nbActionUnits);
  }

  setNeutralWithoutHeadTurn(smoothTime) {
    this.setNeutral(smoothTime);
    this.currentWeightTargets.fill(0, 0, 50);
    this.currentWeightSmooth.fill(smoothTime, 0, 50);
    this.currentWeightTargets.fill(0, 55, 60);
    this.currentWeightSmooth.fill(smoothTime, 55, 60);
    this.currentWeightTargets.fill(0, 63, this.nbActionUnits);
    this.currentWeightSmooth.fill(smoothTime, 63, this.nbActionUnits);
  }

  setLookBottomLeft(smoothTime) {
    this.currentWeightTargets[51] = 20;
    this.currentWeightTargets[54] = 40;
    this.currentWeightSmooth.fill(smoothTime, 51, 55);
  }

  setLookBottomRight(smoothTime) {
    this.currentWeightTargets[52] = 20;
    this.currentWeightTargets[54] = 40;
    this.currentWeightSmooth.fill(smoothTime, 52, 55);
  }

  setLookUpLeft(smoothTime) {
    this.currentWeightTargets[51] = 10;
    this.currentWeightTargets[53] = 10;
    this.currentWeightSmooth.fill(smoothTime, 51, 54);
  }

  setLookUpRight(smoothTime) {
    this.currentWeightTargets[52] = 90;
    this.currentWeightTargets[53] = 90;
    this.currentWeightSmooth.fill(smoothTime, 52, 54);
  }

  setTargetEmotion(emotionName, intensity, smoothTime) {
    this.setNeutralWithoutHeadTurn(smoothTime);
    const EmotionIndex = this.EmotionsList.findIndex(elem => elem.name === emotionName);
    const AUS = this.EmotionsList[EmotionIndex].code;
    this.setTargetEmotionString(AUS, intensity, smoothTime);
  }

  setTargetEmotionString(emotionString, intensity, smoothTime) {
    const arrayAU = emotionString.split("+");
    arrayAU.forEach(subString => this.setTargetEmotionSubstring(subString, intensity, smoothTime));
  }

  setTargetEmotionSubstring(element, globalIntensity, smoothTime) {
    const lOrR = element[0] === 'R' || element[0] === 'L' ? element[0] : null;
    element = lOrR ? element.substring(1) : element;
    const intensity = isNaN(parseInt(element.slice(-1))) ? element.slice(-1) : '1.0';
    const numericIntensity = { 'A': 0.2, 'B': 0.4, 'C': 0.6, 'D': 0.8, 'E': 1.0 }[intensity] || 1.0;
    const AU = isNaN(parseInt(intensity)) ? element.slice(0, -1) : element;
    this.setTargetAU(AU, 100.0 * numericIntensity * globalIntensity, lOrR, smoothTime);
  }

  setTargetAU(AU, intensity, lOrR, smoothTime) {
    const AUIndex = this.ActionUnitsList.findIndex(elem => elem.id === AU);
    if (AUIndex !== -1) {
      this.currentWeightTargets[AUIndex] = intensity;
      this.currentWeightSmooth[AUIndex] = smoothTime;
      this.engine.setAU(AUIndex, intensity, lOrR);
    }
  }

  getTargetAU(AU) {
    const AUIndex = this.ActionUnitsList.findIndex(elem => elem.id === AU);
    return this.currentWeightTargets[AUIndex];
  }

  setNeutralViseme(smoothTime=0) {
    this.currentWeightTargets.fill(0, this.nbActionUnits, this.nbActionUnits + this.nbVisemes);
    this.currentWeightSmooth.fill(smoothTime, this.nbActionUnits, this.nbActionUnits + this.nbVisemes);
  }

  setTargetViseme(VisemeIndex, intensity, smoothTime) {
    this.setNeutralViseme(smoothTime);
    this.currentWeightTargets[this.nbActionUnits + VisemeIndex] = intensity;
    this.currentWeightSmooth[this.nbActionUnits + VisemeIndex] = smoothTime;
  }

  getTargetViseme(VisemeIndex) {
    return this.currentWeightTargets[this.nbActionUnits + VisemeIndex];
  }

  setEyeTarget(x, y, z, eyesWeight, eyesSmoothTime, headWeight, headSmoothTime, debugVisible) {
    this.engine.setEyeTarget(x, y, z, eyesWeight, eyesSmoothTime, headWeight, headSmoothTime, debugVisible);
  }

  setCameraPosition(x, y, z, rx, ry, rz) {
    this.engine.setCameraPosition(x, y, z, rx, ry, rz);
  }

  updateEngine() {
    this.engine.setTargets(this.currentWeightTargets, this.currentWeightSmooth);
  }
}

export { FacsLib };

