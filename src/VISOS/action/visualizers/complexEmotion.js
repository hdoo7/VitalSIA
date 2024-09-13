function startComplexEmotion(animationManager) {
    // Schedule the initial surprise expression
    animationManager.scheduleChange('Surprise', 100, 2, 0); // AU for surprise, intensity, duration, delay

    // Schedule happiness to start after surprise and loop indefinitely
    setTimeout(() => {
        animationManager.scheduleChange('Happiness', 100, 5, 0); // AU for happiness, intensity, duration, delay
        animationManager.loop(-1); // Loop indefinitely for happiness
    }, 2000); // Start happiness after the surprise

    // Schedule nodding to start immediately and loop a fixed number of times
    scheduleNodding(animationManager, 3); // Loop nodding 3 times
}

function scheduleNodding(animationManager, times) {
    const noddingSequence = [
        () => animationManager.scheduleChange('NodDown', 100, 1, 0), // Nod down
        () => animationManager.scheduleChange('NodUp', 100, 1, 500) // Nod up, with a slight delay to simulate natural motion
    ];

    // Enqueue and loop the nodding sequence
    noddingSequence.forEach(action => animationManager.enqueueAction(action));
    animationManager.loop(times);
}

export { startComplexEmotion };
