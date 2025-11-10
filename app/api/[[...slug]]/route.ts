
// app/api/[[...slug]]/route.ts
import { NextResponse } from 'next/server'
import { getSupabaseServerComponentClient } from '@/lib/supabase/server'

export async function GET(request: Request, {params}: {params: {slug: string[]}}) {
  const supabase = getSupabaseServerComponentClient()
  const { data, error } = await supabase.from(params.slug[0]).select(params.slug[1])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}
