
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  const { text, detailLevel, format, tone, includeTldr, userId } = await req.json();
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  );

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Summarize the following text based on these options:
  Detail Level: ${detailLevel}
  Format: ${format}
  Tone: ${tone}
  Include TL;DR: ${includeTldr}

  Text: ${text}
  `;

  const result = await model.generateContent(prompt);
  const summary = await result.response.text();
  
  const title = await model.generateContent(`Generate a short, descriptive title for this text: ${text}`);
  const titleText = await title.response.text();

  if (userId) {
    const { data: summaryData, error: summaryError } = await supabase
      .from('summaries')
      .insert([{ user_id: userId, title: titleText, content: summary }])
      .select('id');

    if (summaryError) {
      return NextResponse.json({ error: summaryError.message }, { status: 500 });
    }

    const summaryId = summaryData[0].id;

    const { error: recentError } = await supabase
      .from('recents')
      .insert([{ user_id: userId, title: titleText, tool: 'summary', tool_id: summaryId }]);

    if (recentError) {
      console.error('Error inserting into recents:', recentError);
    }
  }

  return NextResponse.json({ summary, title: titleText });
}
