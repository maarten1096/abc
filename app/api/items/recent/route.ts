
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse(
      JSON.stringify({ ok: false, message: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { data, error } = await supabase
    .from('user_items')
    .select('id, title, description, type, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) {
    console.error('Error fetching recent items:', error);
    return new NextResponse(
        JSON.stringify({ ok: false, message: 'Failed to fetch recent items', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.json({ ok: true, items: data });
}
