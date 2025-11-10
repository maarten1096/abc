
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { query, type_filter, limit = 5 } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse(
      JSON.stringify({ ok: false, message: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!query) {
    return new NextResponse(
        JSON.stringify({ ok: false, message: 'Query is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 1. Generate embedding for the query
  let queryEmbedding;
  try {
    const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: query,
    });
    queryEmbedding = embeddingResponse.data[0].embedding;
  } catch (e) {
    console.error('Error generating query embedding:', e);
    return new NextResponse(
        JSON.stringify({ ok: false, message: 'Failed to generate query embedding' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. Query the database using the search_items RPC
  const { data, error } = await supabase.rpc('search_items', {
    p_user_id: user.id,
    query_embedding: queryEmbedding,
    match_threshold: 0.55, // Start with a reasonable threshold
    match_count: limit,
    p_type_filter: type_filter || null,
  });

  if (error) {
    console.error('Error searching items:', error);
    return new NextResponse(
        JSON.stringify({ ok: false, message: 'Failed to search items', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.json({ ok: true, matches: data });
}
