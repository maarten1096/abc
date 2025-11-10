// app/api/[[...slug]]/route.ts
import {NextResponse} from 'next/server'
import {getSupabaseRouteHandler} from '@/lib/supabase/server'

export async function GET(request: Request, {params}: {params: {slug: string[]}}) {
  const supabase = getSupabaseRouteHandler()
  const {data, error} = await supabase.from(params.slug[0]).select()
  if (error) return NextResponse.json({error}, {status: 500})
  return NextResponse.json(data)
}
