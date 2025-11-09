
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const geminiStream = await genAI
    .getGenerativeModel({ model: 'gemini-pro' })
    .generateContentStream({
      contents: [
        ...messages.map((message: any) => ({
          role: message.role,
          parts: [{ text: message.content }],
        })),
      ],
    });

  return new StreamingTextResponse(GoogleGenerativeAIStream(geminiStream));
}
