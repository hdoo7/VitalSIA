
import  Engine3D  from './unity/facs/engine3d'
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('./unityCacheServiceWorker.js', import.meta.url)).then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
import  './unity/unitySettings'

// import { loopSmileAndFrown } from './VISOS/effectors/facialExpressions'; // Adjust the path as necessary

// // Start the loop of smile and frown animations
// loopSmileAndFrown();