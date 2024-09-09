class TextToGptReconciler {
    constructor(apiKey) {
        this.openai = new Object({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true // Replace with your actual API key
        });
    }
}

export default TextToGptReconciler;