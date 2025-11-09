
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

interface Question {
    question: string;
    options: string[];
    answer: string;
    explanation?: string;
}

export default function QuizTool() {
  const { theme } = useTheme();
  const [session, setSession] = useState<Session | null>(null);
  const [amount, setAmount] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [questionType, setQuestionType] = useState('multiple-choice');
  const [timer, setTimer] = useState(false);
  const [shuffleAnswers, setShuffleAnswers] = useState(false);
  const [instantFeedback, setInstantFeedback] = useState(true);
  const [includeExplanations, setIncludeExplanations] = useState(true);
  const [text, setText] = useState('');
  const [quiz, setQuiz] = useState<{ questions: Question[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const handleSubmit = async () => {
    if (!session) {
      alert('Please log in to use this feature.');
      return;
    }
    setLoading(true);
    setQuiz(null);
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          amount,
          difficulty,
          questionType,
          timer,
          shuffleAnswers,
          instantFeedback,
          includeExplanations,
          userId: session.user.id,
        }),
      });
      const data = await response.json();
      setQuiz(data.quiz);
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
       <div className="flex items-center space-x-4 mb-4">
        {/* ... your options form ... */}
      </div>
      <textarea
        className="w-full p-2 rounded-md resize-none overflow-y-auto bg-transparent mb-4"
        style={{ border: `1.5px solid ${theme.accent}`, color: theme.accent }}
        placeholder="Enter text to generate a quiz from..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />
      <button onClick={handleSubmit} className="px-4 py-2 rounded-md" style={{ backgroundColor: theme.accent, color: theme.main }} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Quiz'}
      </button>

      {quiz && (
        <div className="mt-8">
          {quiz.questions.map((q, i) => (
            <div key={i} className="mb-6 p-4 rounded-md" style={{ border: `1.5px solid ${theme.accent}` }}>
              <p className="font-bold" style={{ color: theme.accent }}>{i + 1}. {q.question}</p>
              <div className="mt-2 space-y-2">
                {q.options.map((opt, j) => (
                    <button key={j} className="block w-full text-left p-2 rounded-md" style={{backgroundColor: theme.sidebar, color: theme.accent}}>
                        {opt}
                    </button>
                ))}
              </div>
              {/* You can add logic here to show answer and explanation based on user interaction */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
