const data = [
  //blink
  {"id":"12","intensity":0.3333333333333333,"duration":750,"explanation":""},
  {"id":"51","intensity":0.044444444444444446,"duration":750,"explanation":""},
  {"id":"53","intensity":0.05555555555555555,"duration":750,"explanation":""},
  {"id":"55","intensity":0.13333333333333333,"duration":750,"explanation":""},

  //smile
  {"id": "45", "intensity": 1.5555555555555555, "duration": 750, "explanation": ""},
  {"id": "45", "intensity": 1.3333333333333333, "duration": 750, "explanation": ""},
  {"id": "45", "intensity": 1.1111111111111112, "duration": 750, "explanation": ""},
  {"id": "45", "intensity": 0.5555555555555555, "duration": 750, "explanation": ""},
  {"id": "45", "intensity": 0.2222222222222222, "duration": 750, "explanation": ""},
  {"id": "45", "intensity": 0.0000000000000000, "duration": 750, "explanation": ""},

  //cheeks up
  {"id":"6","intensity":0.7777777777777778,"duration":750,"explanation":""},
  {"id":"12","intensity":0.3703703703703703,"duration":750,"explanation":""},
  {"id":"51","intensity":0.04938271604938272,"duration":750,"explanation":""},
  {"id":"53","intensity":0.06172839506172839,"duration":750,"explanation":""},
  {"id":"55","intensity":0.14814814814814817,"duration":750,"explanation":""},

  //head tilt lift
  {"id":"6","intensity":0.8641975308641976,"duration":750,"explanation":""},
  {"id":"12","intensity":0.4115226337448559,"duration":750,"explanation":""},
  {"id":"53","intensity":0.06858710562414266,"duration":750,"explanation":""},
  {"id":"55","intensity":0.3888888888888889,"duration":750,"explanation":""},

  {"id":"55","intensity":0.3888888888888889,"duration":750,"explanation":""},
  {"id":"53","intensity":0.06858710562414266,"duration":750,"explanation":""},
  {"id":"12","intensity":0.4115226337448559,"duration":750,"explanation":""},
  {"id":"6","intensity":0.8641975308641976,"duration":750,"explanation":""},

  //unsmile
  {"id": "45", "intensity": 0.2222222222222222, "duration": 750, "explanation": ""},
  {"id": "45", "intensity": 0.5555555555555555, "duration": 750, "explanation": ""},
  {"id": "45", "intensity": 1.1111111111111112, "duration": 750, "explanation": ""},
  {"id": "45", "intensity": 1.3333333333333333, "duration": 750, "explanation": ""},
  {"id": "45", "intensity": 1.5555555555555555, "duration": 750, "explanation": ""},

  //cheek down
  {"id":"55","intensity":0.14814814814814817,"duration":750,"explanation":""},
  {"id":"53","intensity":0.06172839506172839,"duration":750,"explanation":""},
  {"id":"51","intensity":0.04938271604938272,"duration":750,"explanation":""},
  {"id":"12","intensity":0.3703703703703703,"duration":750,"explanation":""},
  {"id":"6","intensity":0.7777777777777778,"duration":750,"explanation":""},


]

// Function to start animation using data
export function start(animationManager, settings) {
  let index = 0;
  const interval = 100; // 0.1 seconds

  // Function to handle the animation schedule
  const animate = () => {
    if (index < data.length) {
      const item = data[index];
      animationManager.scheduleChange(item.id, item.intensity * 100, item.duration, 0);
      index++;
    } else {
      clearInterval(animationInterval);
    }
  };

  // Start the animation with the given interval
  const animationInterval = setInterval(animate, interval);
}

export function stop(animationManager) {
  data.forEach(item => {
    animationManager.scheduleChange(item.id, 0, item.duration, 0);
  });
}
  