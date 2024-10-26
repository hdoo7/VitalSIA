
# Hooks Documentation

## **`useConvo` Hook**

The `useConvo` hook is your friendly neighbourhood conversation manager. It seamlessly orchestrates the grand ballet of speech recognition, thinking pauses, and AI-driven responses. You might say it’s the conductor for the orchestra of awkward silences and clever repartee between user and machine.

### Parameters:
- **`audioToText`** - Ah yes, the unsung hero of voice input. This plucky little instance transcribes spoken words into text—how quaint. It must be passed in so that our machine can attempt to understand what you're blathering on about.
- **`voiceManager`** - The voice of reason, quite literally. This chap does the talking for the system. Without it, well, you might as well be sending your responses via carrier pigeon.
- **`gptFlowGenerator`** - A generator function that handles the flow of your entire AI-driven conversation. Think of it as the scriptwriter who determines whether your conversation goes full Shakespearean tragedy or remains polite afternoon tea chit-chat. It ensures a structured dialogue between you and the machine.

### Usage Example:
\`\`\`jsx
const { conversationState, startConversation, stopConversation } = useConvo(audioToText, voiceManager, gptFlowGenerator);

useEffect(() => {
    startConversation(); // This kicks off the conversation—like a proper British butler offering you a cup of tea
    return () => stopConversation(); // And then stops it gracefully when you’re done, perhaps with a slight bow
}, [startConversation, stopConversation]);
\`\`\`

### Expanded Explanation:
- **`conversationState`**: Tracks what’s happening. Is the machine listening to you attentively (or pretending to)? Is it thinking (probably overcomplicating things)? Or is it speaking (finally!). 
- **`startConversation()`**: Begins the conversational flow. The AI will start babbling once you’ve called this. 
- **`stopConversation()`**: When you’ve had enough of the chatter or need a break from the onslaught of intelligent responses, this halts the conversation.

### More Fun:
Let’s say you’re building a chat for a Virtual Assistant—perhaps one that likes to *over-explain*. This hook keeps the dialogue structured and ensures your AI doesn’t start talking before you’ve even finished your coffee.

---

## **`useMirroring` Hook**

The `useMirroring` hook is for those moments when you want your virtual agent to not only talk but *feel*. It mirrors emotions detected via input (like the user's facial expressions) onto a visual agent—a virtual reflection of the user’s joy, frustration, or mild confusion. The agent could be a friendly chatbot avatar, or, if you’re feeling particularly ambitious, a robotic butler who looks disappointed when you ask for Earl Grey instead of Darjeeling.

### Parameters:
- **`animationManager`** - This little mastermind controls how the virtual agent displays emotions. Does your agent grin like a Cheshire Cat or frown like a confused accountant? This manager makes it happen.
- **`emotionState`** - The emotional input. Here’s where the magic happens. The `emotionState` contains detected emotions (e.g., *joy*, *sadness*, *existential dread*) and their intensities. Pass this in, and watch your agent reflect them with unsettling realism.

### Example Usage:
\`\`\`jsx
useMirroring(animationManager, emotionState);
\`\`\`

### Expanded Explanation:
- **`animationManager`**: Without this, the agent would be expressionless—a blank canvas that’s more akin to an unenthusiastic mannequin. This manager ensures your agent actually responds like a normal-ish being.
- **`emotionState`**: Here’s where the juice is. If your user is overjoyed (or pretending to be), the agent needs to reflect that with at least a toothy grin. If they’re sad, maybe the agent should take on the appearance of an ‘80s melodramatic soap opera actor in despair.

---

## **`useEmo` Hook**

Now, this one is for when you want to get serious about emotions. It listens to input, detects the user's emotional state, and updates it in real-time. It's like an emotion barometer that can detect whether the user is on the verge of laughter or about to hurl their phone at the wall.

### Parameters:
- **`emotionInput`** - This could be data from a camera (facial expressions) or voice (tone analysis). It’s the raw data that will eventually tell you if your user is joyful, or perhaps experiencing the profound ennui that comes from talking to yet another chatbot.
- **`setEmotionState`** - A function to update the detected emotion state. Think of this as your emotion handler—processing the detected inputs into something usable, like a bright, cheery “joy” or a slow-burning “anger.”

### Usage:
\`\`\`jsx
useEmo(emotionInput, setEmotionState);
\`\`\`

### Expanded Explanation:
- **`emotionInput`**: This is where you shove in all the raw emotion data. It's the emotional feed from whatever sensor you’re using. Think camera-based facial recognition, voice tone analyzers—heck, if you want to get weird, a brainwave scanner. 
- **`setEmotionState`**: This function is what takes your raw emotion data and turns it into something actionable. It says: *Hey! The user’s smiling!* or *Careful, they’re frowning again…*

---

### **Practical Example: The `emoFrenchQuiz` Component**

Let’s put all of this together in the fabulous `emoFrenchQuiz` component. This component uses `useConvo`, `useMirroring`, and `useEmo` to manage a conversational quiz that not only responds to user inputs but also reflects their emotional state on a virtual tutor.

\`\`\`jsx
const QuizApp = ({ animationManager }) => {
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [emotionState, setEmotionState] = useState(null);  // Track emotionState for mirroring
    const toast = useToast();
    
    const questions = useMemo(() => [
        { french: "Bonjour", english: "Hello" },
        { french: "Merci", english: "Thank you" },
        { french: "Chat", english: "Cat" }
    ], []);

    const quizFlowGenerator = useMemo(() => function* () {
        for (let i = 0; i < questions.length; i++) {
            let userAnswer = yield \`Que veut dire \${questions[i].french} en anglais ?\`;
            if (userAnswer.toLowerCase().includes(questions[i].english.toLowerCase())) {
                setCorrectAnswers(prev => prev + 1);
                yield \`Correct!\`;
            } else {
                yield \`Incorrect. La réponse correcte est: \${questions[i].english}\`;
            }
        }
        yield \`Vous avez terminé le quiz! Score: \${correctAnswers}\`;
    }, [questions, correctAnswers]);

    const audioToText = new AudioToText('webspeech');
    const voiceManager = VoiceManager.getInstance(animationManager);
    const { conversationState, startConversation, stopConversation } = useConvo(audioToText, voiceManager, quizFlowGenerator);
    
    useEffect(() => {
        startConversation();
        return () => stopConversation();
    }, [startConversation, stopConversation]);

    useMirroring(animationManager, emotionState);

    return (
        <div>
            <EmotionDetection onEmotionStateChange={setEmotionState} />
            <TrafficLightIndicator status={conversationState.status} />
            <div>Correct Answers: {correctAnswers}</div>
        </div>
    );
};
\`\`\`
