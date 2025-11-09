
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { supabase } from '../lib/supabase';

interface Question {
  question: string;
  options: string[];
  answer: string;

}

export default function QuizTool() {
  const { theme } = useTheme();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase.from('questions').select('*');
      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        setQuestions(data);
      }
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return; // Prevent changing answer

    setSelectedOption(option);
    if (option === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  }

  const getButtonColor = (option: string) => {
    if (!selectedOption) {
      return theme.sidebar;
    }
    if (option === questions[currentQuestion].answer) {
      return '#28a745'; // Green for correct
    }
    if (option === selectedOption) {
      return '#dc3545'; // Red for incorrect
    }
    return theme.sidebar;
  }
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center" style={{ color: theme.accent }}>
        <h2 className="text-3xl font-bold mb-4">Loading Quiz...</h2>
      </div>
    )
  }

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center" style={{ color: theme.accent }}>
        <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
        <p className="text-xl mb-6">Your score: {score} / {questions.length}</p>
        <button 
          onClick={handleRestartQuiz}
          className="p-3 rounded-lg font-semibold"
          style={{ backgroundColor: theme.accent, color: theme.sidebar }}
        >
          Restart Quiz
        </button>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center" style={{ color: theme.accent }}>
            <h2 className="text-3xl font-bold mb-4">Error</h2>
            <p className="text-xl mb-6">Could not load questions. Make sure you have run the schema.sql file in your Supabase project.</p>
        </div>
    )
  }

  return (
    <div className="flex flex-col h-full items-center justify-center" style={{ color: theme.accent }}>
      <div className='w-full max-w-2xl'>
        {/* Progress Bar */}
        <div className='w-full rounded-full h-2.5 mb-4' style={{backgroundColor: theme.sidebar}}>
            <div className='h-2.5 rounded-full' style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%`, backgroundColor: theme.accent }}></div>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold mb-6 text-center">{questions[currentQuestion].question}</h2>
        
        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {questions[currentQuestion].options.map(option => (
            <button
              key={option}
              className={`p-4 rounded-lg text-left text-lg font-medium transition-transform duration-200 ${selectedOption ? 'transform-none' : 'hover:scale-105'}`}
              style={{
                backgroundColor: getButtonColor(option),
                color: theme.accent,
                opacity: selectedOption && option !== selectedOption && option !== questions[currentQuestion].answer ? 0.6 : 1,
              }}
              onClick={() => handleOptionSelect(option)}
              disabled={!!selectedOption}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Next Button */}
        {selectedOption && (
          <div className="text-center">
            <button 
              onClick={handleNextQuestion}
              className="p-3 rounded-lg font-semibold w-full md:w-auto"
              style={{ backgroundColor: theme.accent, color: theme.sidebar }}
             >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
