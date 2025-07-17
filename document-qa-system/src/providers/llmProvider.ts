// // import { createOllama } from '@ai-sdk/ollama';
// import { generateText } from 'ai';

// export class LLMProvider {
//   private llm: any;

//   constructor() {
//     // Use Vercel SDK with Ollama as backend
//     this.llm = createOllama({ baseUrl: 'http://localhost:11434' });
//   }

//   async answerQuestion(question: string, context: string[]): Promise<string> {
//     const maxContextLength = 4000;
//     const formattedContext = context.join('\n').slice(0, maxContextLength);

//     const prompt = `Context:\n${formattedContext}\n\nQuestion: ${question}\nAnswer:`;

//     try {
//       const { text } = await generateText({
//         model: this.llm('phi3:mini'), // Or llama3.2:1b, gemma:2b
//         prompt,
//         maxTokens: 500,
//         temperature: 0.7,
//       });

//       return text.trim();
//     } catch (error) {
//       throw new Error(`Failed to generate answer: ${(error as Error).message}`);
//     }
//   }
// }
