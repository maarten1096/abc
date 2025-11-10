
import { streamText, StreamingTextResponse } from 'ai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Assuming you have the GOOGLE_API_KEY in your environment variables
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  // A more robust way to handle the streaming content
  const stream = await model.generateContentStream(messages.map((m: any) => m.content).join('\n'));

  const aiStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(chunk.text());
      }
      controller.close();
    },
  });

  return new StreamingTextResponse(aiStream);
}
