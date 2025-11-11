
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Function to construct the prompt for the AI
const buildPrompt = (mode, inputText, options) => {
    let prompt = `You are an expert AI assistant. A user has provided the following text:\n\n---\n${inputText}\n---\n\n`;

    switch (mode) {
        case 'summary':
            const { summaryLength, summaryStyle, summaryFocus } = options;
            prompt += `Please generate a summary of this text. The user has specified the following preferences:\n`;
            prompt += `- Length: ${summaryLength || 'not specified'}\n`;
            prompt += `- Style: ${summaryStyle || 'not specified'}\n`;
            prompt += `- Focus: ${summaryFocus || 'general'}. If the focus is action items, key questions, or key terms, please ONLY return those items.`;
            return prompt;

        case 'quiz':
            const { quizQuestionType, quizDifficulty } = options;
            prompt += `Generate a quiz based on this text. The user wants:\n`;
            prompt += `- Question Type: ${quizQuestionType || 'multiple choice'}\n`;
            prompt += `- Difficulty: ${quizDifficulty || 'medium'}\n`;
            prompt += `Return the output as a single, minified JSON object with a single key \"questions\". The value should be an array of objects, where each object has a \"question\", an \"options\" array, and a \"correctAnswer\" string. Do not include any other text or explanation.`;
            return prompt;

        case 'flashcards':
            const { flashcardStyle, flashcardIncludeExamples } = options;
            prompt += `Generate flashcards from this text. The user wants:\n`;
            prompt += `- Style: ${flashcardStyle || 'term/definition'}\n`;
            if (flashcardIncludeExamples) {
                prompt += `- Please include a concise example sentence for each card.\n`;
            }
            prompt += `Return the output as a single, minified JSON object with a single key \"cards\". The value should be an array of objects, where each object has a \"term\", a \"definition\", and an optional \"example\". Do not include any other text or explanation.`;
            return prompt;

        default:
            return `Please process the following text: ${inputText}`;
    }
}

export async function POST(request: Request) {
    try {
        const { mode, input_text, options } = await request.json();

        if (!input_text) {
            return new NextResponse('Input text is required', { status: 400 });
        }

        const prompt = buildPrompt(mode, input_text, options);

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            stream: true,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);

    } catch (error) {
        console.error('Error in AI handler:', error);
        // Check if error is an object and has a message property
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: errorMessage }), { status: 500 });
    }
}
