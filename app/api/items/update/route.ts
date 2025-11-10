
import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(req: NextRequest) {
  const { id, title, description, content, save_embedding } = await req.json();

  // For now, we'll use a hardcoded user_id. 
  // In the future, we'll get this from the user's session.
  const user_id = 'f5c6b6a0-5b16-4f33-8299-4782b3a9d0a0'; 

  const { data, error } = await supabase
    .from('user_items')
    .update({ title, description, content, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user_id) // Ensure the user owns the item
    .select()
    .single();

  if (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Error updating item' }, { status: 500 });
  }

  if (save_embedding) {
    // In a real application, you would trigger a background job to re-generate the embedding.
    // For now, we'll just log a message.
    console.log(`Embedding re-generation triggered for item: ${data.id}`);
  }

  return NextResponse.json({ ok: true, item: data }, { status: 200 });
}
