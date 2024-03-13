import { OpenAI } from 'openai';

class TextToGptReconciler {
    constructor() {
        this.openai = new OpenAI({
            apiKey: 'your_openai_api_key_here', // Replace with your actual API key
        });
    }

    processText(text, customPrompt) {
        const fullPrompt = `${customPrompt} "${text}"`;
        return this.openai.createCompletion({
            model: "text-davinci-003",
            prompt: fullPrompt,
            temperature: 0.7,
            max_tokens: 150,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        }).then(response => response.data.choices[0].text);
    }
}

export default TextToGptReconciler;
