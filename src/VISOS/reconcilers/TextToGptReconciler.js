import { OpenAI } from 'openai';

class TextToGptReconciler {
    constructor() {
        this.openai = new OpenAI({
            apiKey: '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',
            dangerouslyAllowBrowser: true // Replace with your actual API key
        });
    }

    processText(text, customPrompt) {
        const fullPrompt = `${customPrompt} "${text}"`;
        return this.openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: 'user', content: fullPrompt }],
            temperature: 0.7,
            max_tokens: 1500,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        }).then(response => response.choices[0].message.content);
    }
}

export default TextToGptReconciler;
