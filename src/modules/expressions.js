const data = [
  //blink
  {"id": "45", "intensity": 0.0, "duration": 750, "explanation": ""},
  {"id": "45", "intensity": 0.5, "duration": 750, "explanation": ""},
  {"id": "45", "intensity": 1.1, "duration": 750, "explanation": ""},
  {"id": "45", "intensity": 0.5, "duration": 750, "explanation": ""},
  {"id": "45", "intensity": 0.0, "duration": 750, "explanation": ""},
  
  //smile
  {"id": "12", "intensity": 0.1, "duration": 750, "explanation": ""},
  {"id": "14", "intensity": 0.2, "duration": 750, "explanation": ""},

  //cheeks up
  {"id":"6","intensity":0.6,"duration":750,"explanation":""},
  {"id":"12","intensity":0.3,"duration":750,"explanation":""},
  {"id":"51","intensity":0.0,"duration":750,"explanation":""},
  {"id":"53","intensity":0.06,"duration":750,"explanation":""},
  {"id":"55","intensity":0.1,"duration":750,"explanation":""},

  //head tilt lift
  {"id":"6","intensity":0.6,"duration":750,"explanation":""},
  {"id":"12","intensity":0.5,"duration":750,"explanation":""},
  {"id":"12","intensity":0.4,"duration":750,"explanation":""},
  {"id":"12","intensity":0.3,"duration":750,"explanation":""},
  {"id":"12","intensity":0.2,"duration":750,"explanation":""},
  {"id":"53","intensity":0.1,"duration":750,"explanation":""},

  //unsmile
  {"id": "14", "intensity": 0.2, "duration": 750, "explanation": ""},
  {"id": "12", "intensity": 0.1, "duration": 750, "explanation": ""},

]

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

      // Wait for 5 seconds after the last item
      setTimeout(() => {
        console.log('5 seconds have passed since the last animation.');
        // Perform any final actions if necessary
      }, 5000);
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
  