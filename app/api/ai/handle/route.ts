
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { mode, input_text, options } = await request.json();

  if (mode === 'summary') {
    if (!input_text) {
      return new NextResponse('Input text is required', { status: 400 });
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes text. Provide a concise summary of the following text:',
          },
          {
            role: 'user',
            content: input_text,
          },
        ],
      });

      const stream = OpenAIStream(response);
      return new StreamingTextResponse(stream);

    } catch (error) {
      console.error('Error generating summary:', error);
      return new NextResponse('Error generating summary', { status: 500 });
    }
  }

  return new NextResponse('Invalid mode', { status: 400 });
}
