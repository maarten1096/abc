
import { NextRequest, NextResponse } from 'next/server';
import { run as getCompletion } from '@/lib/providers/openai';

// This function handles all AI generation requests
export async function POST(req: NextRequest) {
    try {
        const { text, tool, options } = await req.json();

        if (!text || !tool) {
            return NextResponse.json({ error: 'Missing text or tool' }, { status: 400 });
        }

        let completion = '';
        const model = 'gpt-4o'; // Using a more powerful model

        switch (tool) {
            case 'summary':
                completion = await getCompletion(`Summarize the following text based on these options: ${JSON.stringify(options)}\n\nText: ${text}`, { model });
                return NextResponse.json({ summary: completion });

            case 'quiz':
                completion = await getCompletion(`Create a quiz based on the following text and options: ${JSON.stringify(options)}\n\nText: ${text}\n\nIMPORTANT: Respond with only valid JSON.`, { model });
                return NextResponse.json(JSON.parse(completion));

            case 'flashcards':
                completion = await getCompletion(`Create flashcards based on the following text and options: ${JSON.stringify(options)}\n\nText: ${text}\n\nIMPORTANT: Respond with only valid JSON.`, { model });
                return NextResponse.json(JSON.parse(completion));

            default:
                return NextResponse.json({ error: 'Invalid tool' }, { status: 400 });
        }

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: (error as Error).message || 'An unknown error occurred' }, { status: 500 });
    }
}
