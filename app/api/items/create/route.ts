
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { title, description, type, content, file_id, save_embedding } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse(
      JSON.stringify({ ok: false, message: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Generate content_hash
  const contentString = JSON.stringify(content);
  const contentHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(contentString));
  const contentHashString = Array.from(new Uint8Array(contentHash)).map(b => b.toString(16).padStart(2, '0')).join('');

  const { data, error } = await supabase
    .from('user_items')
    .insert([
      {
        user_id: user.id,
        title,
        description,
        type,
        content,
        file_id,
        content_hash: contentHashString,
      },
    ])
    .select('id, title, description, type, created_at')
    .single();

  if (error) {
    console.error('Error creating item:', error);
    return new NextResponse(
        JSON.stringify({ ok: false, message: 'Failed to create item', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (save_embedding && data) {
    // In a real-world scenario, this would be a durable job queue.
    // Here we'll just fire-and-forget an API call to our own embedding endpoint.
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/embeddings/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}` // Secure call from backend to backend
        },
        body: JSON.stringify({ item_id: data.id }),
    });
  }

  return NextResponse.json({ ok: true, item: data });
}
