
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  const { text, amount, difficulty, questionType, timer, shuffleAnswers, instantFeedback, includeExplanations, userId } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Generate a quiz based on the following text and options:
  Amount of questions: ${amount}
  Difficulty: ${difficulty}
  Question Type: ${questionType}
  Timer: ${timer}
  Shuffle Answers: ${shuffleAnswers}
  Instant Feedback: ${instantFeedback}
  Include Explanations: ${includeExplanations}

  Text: ${text}

  The output should be a JSON object with a "questions" property, which is an array of question objects. Each question object should have the following properties: "question", "options" (an array of strings), and "answer". If includeExplanations is true, also include an "explanation" property.
  `;

  const result = await model.generateContent(prompt);
  const quiz = await result.response.text();
  const quizJson = JSON.parse(quiz);
  
  const title = await model.generateContent(`Generate a short, descriptive title for this text: ${text}`);
  const titleText = await title.response.text();

  const { data: quizData, error: quizError } = await supabase
    .from('quizzes')
    .insert([{ user_id: userId, title: titleText, questions: quizJson }])
    .select('id');

  if (quizError) {
    return NextResponse.json({ error: quizError.message }, { status: 500 });
  }

  const quizId = quizData[0].id;

  const { error: recentError } = await supabase
    .from('recents')
    .insert([{ user_id: userId, title: titleText, tool: 'quiz', tool_id: quizId }]);

  if (recentError) {
    console.error('Error inserting into recents:', recentError);
  }

  return NextResponse.json({ quiz: quizJson, title: titleText });
}
