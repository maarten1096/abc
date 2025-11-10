// app/api/ai/route.ts
import {NextResponse} from 'next/server'
import {runProvider} from '@/lib/providers'

export async function POST(req: Request) {
  try {
    const {prompt, provider, opts} = await req.json()
    const output = await runProvider(prompt, provider, opts)
    return NextResponse.json({output})
  } catch (err: any) {
    return NextResponse.json({error: err.message}, {status: 500})
  }
}
