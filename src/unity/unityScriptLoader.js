
function loadUnityScript(scriptUrl, callback) {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.onload = () => {
        console.log("Unity loader script loaded successfully.");
        if (typeof callback === "function") {
            callback();
        }
    };
    script.onerror = () => console.error("Failed to load Unity loader script.");
    document.head.appendChild(script);
}

// Example usage:
// loadUnityScript("https://evalibre.blob.core.windows.net/evalibre/UnityLoader.js", function() {
//     console.log("This code runs after the Unity script has loaded.");
//     // Initialize Unity settings or perform other actions here
// });

export { loadUnityScript };