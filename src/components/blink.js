const data = [
    {"id": "45", "intensity": 0.0000000000000000, "duration": 750, "explanation": ""},
    {"id": "45", "intensity": 0.5555555555555555, "duration": 750, "explanation": ""},
    {"id": "45", "intensity": 1.1111111111111112, "duration": 750, "explanation": ""},
    {"id": "45", "intensity": 0.5555555555555555, "duration": 750, "explanation": ""},
    {"id": "45", "intensity": 0.0000000000000000, "duration": 750, "explanation": ""}
  ];
  
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
  