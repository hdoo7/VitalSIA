const data = [
  { id: "4", intensity: 0.2222, duration: 750, explanation: "" },
  { id: "4", intensity: 0.4444, duration: 750, explanation: "" },
  { id: "15", intensity: 0.2278, duration: 750, explanation: "" },
  { id: "15", intensity: 0.5556, duration: 750, explanation: "" },
  { id: "65", intensity: 0.2222, duration: 750, explanation: "" },
  { id: "65", intensity: 0.4444, duration: 750, explanation: "" }
];


  
  // Function to start animation using data
  export function start(animationManager, settings) {
    data.forEach(item => {
      animationManager.scheduleChange(item.id, item.intensity * 100, item.duration, 0);
    });
  }
  
  // Function to stop animation by setting intensity to 0
  export function stop(animationManager) {
    data.forEach(item => {
      animationManager.scheduleChange(item.id, 0, item.duration, 0);
    });
  }
  