
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export async function POST(request: Request) {
    // Security check: Only allow calls from trusted backend services
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_KEY}`) {
        return new NextResponse(
            JSON.stringify({ ok: false, message: 'Unauthorized' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

  const { item_id } = await request.json();

  if (!item_id) {
    return new NextResponse(
        JSON.stringify({ ok: false, message: 'item_id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 1. Fetch the item content
  const { data: item, error: itemError } = await supabaseAdmin
    .from('user_items')
    .select('title, description, content, tags, user_id')
    .eq('id', item_id)
    .single();

  if (itemError || !item) {
    console.error('Error fetching item for embedding:', itemError);
    return new NextResponse(
        JSON.stringify({ ok: false, message: 'Item not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. Build the embedding input string
  const textSnippet = item.content?.text ? String(item.content.text).substring(0, 2000) : '';
  const tagsString = item.tags ? item.tags.join(', ') : '';
  const embeddingInput = [
    item.title,
    item.description,
    textSnippet,
    tagsString
  ].filter(Boolean).join(' || ');

  // 3. Generate the embedding
  let embedding;
  try {
    const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: embeddingInput,
    });
    embedding = embeddingResponse.data[0].embedding;
  } catch (e) {
    console.error('Error generating embedding:', e);
    return new NextResponse(
        JSON.stringify({ ok: false, message: 'Failed to generate embedding' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 4. Store the vector in item_embeddings
  const { error: insertError } = await supabaseAdmin
    .from('item_embeddings')
    .insert({
        item_id: item_id,
        user_id: item.user_id,
        embedding: embedding,
    });

  if (insertError) {
    console.error('Error inserting embedding:', insertError);
    return new NextResponse(
        JSON.stringify({ ok: false, message: 'Failed to insert embedding' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.json({ ok: true });
}
