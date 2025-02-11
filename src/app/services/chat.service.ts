import { Injectable } from '@angular/core';
import { pipeline, env, Pipeline, TextGenerationPipeline } from '@huggingface/transformers';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private model: TextGenerationPipeline | ((arg0: string, arg1: { max_new_tokens: number; do_sample: boolean; }) => any) | undefined;

    constructor() {
        this.loadModel();
    }

    private async loadModel() {
        env.allowLocalModels = false; // Change to true if you want to load local models
        this.model = await pipeline('text-generation', 'Open-Orca/Mistral-7B-OpenOrca');
    }

    async generateResponse(messages: { role: string; content: string }[]): Promise<string> {
        if (!this.model) {
            throw new Error('Model not loaded yet');
        }

        const prompt = this.formatChatHistory(messages);
        const output = await this.model(prompt, {
            max_new_tokens: 100,
            do_sample: true
        });

        return output[0].generated_text;
    }

    //   private formatChatHistory(messages: { role: string; content: string }[]): string {
    //     return messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    //   }
    private formatChatHistory(messages: { role: string; content: string }[]): string {
        let formatted = "";

        for (const message of messages) {
            if (message.role === "user") {
                formatted += `<|user|>\n${message.content}\n`;
            } else if (message.role === "assistant") {
                formatted += `<|assistant|>\n${message.content}\n`;
            }
        }

        formatted += "<|assistant|>\n"; // Ensures the model knows it's time to generate a response

        return formatted;
    }
}
