// lib/supabase/middleware.ts
import {createMiddlewareClient} from '@supabase/ssr'
import {NextResponse, type NextRequest} from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({request: {headers: request.headers}})

  const supabase = createMiddlewareClient({
    req: request,
    res: response,
  }, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  })

  const {data} = await supabase.auth.getSession()

  if (data.session) {
    // todo: check for guest user
  }

  return response
}
