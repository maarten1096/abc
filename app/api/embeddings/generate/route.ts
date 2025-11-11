
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { item_id } = await req.json();

  const { data: item, error: itemError } = await supabase
    .from('user_items')
    .select('*')
    .eq('id', item_id)
    .single();

  if (itemError) {
    return NextResponse.json({ error: itemError.message }, { status: 500 });
  }

  const inputText = `${item.title} ${item.description} ${item.content.text}`;

  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: inputText,
  });

  const embedding = embeddingResponse.data[0].embedding;

  const { data: embeddingData, error: embeddingError } = await supabase
    .from('item_embeddings')
    .insert([
      {
        item_id: item.id,
        user_id: item.user_id,
        embedding: embedding,
      },
    ])
    .select();

  if (embeddingError) {
    return NextResponse.json({ error: embeddingError.message }, { status: 500 });
  }

  await supabase
    .from('user_items')
    .update({ embedding_id: embeddingData[0].id })
    .eq('id', item.id);

  return NextResponse.json({ success: true });
}
