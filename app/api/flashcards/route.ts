
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  const { text, amount, style, includePictures, spacedRepetition, gamifiedMode, userId } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite-001' });

  const prompt = `Generate flashcards based on the following text and options:
  Amount of flashcards: ${amount}
  Style: ${style}
  Include Pictures: ${includePictures}
  Spaced Repetition: ${spacedRepetition}
  Gamified Mode: ${gamifiedMode}

  Text: ${text}

  The output should be a JSON object with a "flashcards" property, which is an array of flashcard objects. Each flashcard object should have the following properties: "front" and "back".
  `;

  const result = await model.generateContent(prompt);
  const flashcards = await result.response.text();
  const flashcardsJson = JSON.parse(flashcards);
  
  const title = await model.generateContent(`Generate a short, descriptive title for this text: ${text}`);
  const titleText = await title.response.text();

  const { data: flashcardData, error: flashcardError } = await supabase
    .from('flashcards')
    .insert([{ user_id: userId, title: titleText, flashcards: flashcardsJson }])
    .select('id');

  if (flashcardError) {
    return NextResponse.json({ error: flashcardError.message }, { status: 500 });
  }

  const flashcardId = flashcardData[0].id;

  const { error: recentError } = await supabase
    .from('recents')
    .insert([{ user_id: userId, title: titleText, tool: 'flashcard', tool_id: flashcardId }]);

  if (recentError) {
    console.error('Error inserting into recents:', recentError);
  }

  return NextResponse.json({ flashcards: flashcardsJson, title: titleText });
}
