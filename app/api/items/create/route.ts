
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, type, content, file_id } = await req.json();

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
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Trigger embedding generation asynchronously
  fetch('/api/embeddings/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ item_id: data[0].id }),
  });

  return NextResponse.json(data[0]);
}
