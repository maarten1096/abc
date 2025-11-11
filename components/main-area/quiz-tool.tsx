
'use client';

import { useState } from 'react';
import { useGenerationStore } from '@/lib/generationStore';
import { Button } from '@/components/ui/button';

export function QuizTool() {
    const { quiz, quizInstantFeedback, isLoading } = useGenerationStore();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
    const [score, setScore] = useState<number | null>(null);

    if (isLoading && !quiz) {
        return <div className="text-center text-gray-500">Generating quiz...</div>;
    }

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return <div className="text-center text-gray-500">Generate a quiz to get started!</div>;
    }

    const handleAnswerSelect = (questionIndex: number, answer: string) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionIndex]: answer,
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleSubmitQuiz = () => {
        let finalScore = 0;
        quiz.questions.forEach((q: any, index: number) => {
            if (selectedAnswers[index] === q.correctAnswer) {
                finalScore++;
            }
        });
        setScore(finalScore);
    };

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isAnswerSelected = selectedAnswers[currentQuestionIndex] !== undefined;

    if (score !== null) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
                <p className="text-xl">Your score: {score} / {quiz.questions.length}</p>
                <Button onClick={() => { setScore(null); setCurrentQuestionIndex(0); setSelectedAnswers({}); }} className="mt-4">
                    Take Again
                </Button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Quiz Time!</h2>
            <div className="mb-4">
                <p className="font-semibold">{currentQuestion.question}</p>
            </div>
            <div className="space-y-2">
                {currentQuestion.options.map((option: string, index: number) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === option;
                    let buttonClass = 'w-full text-left justify-start';
                    if (quizInstantFeedback && isAnswerSelected) {
                        if (isSelected) {
                            buttonClass += option === currentQuestion.correctAnswer ? ' bg-green-200' : ' bg-red-200';
                        }
                    }
                    return (
                        <Button 
                            key={index} 
                            variant="outline" 
                            className={buttonClass}
                            onClick={() => handleAnswerSelect(currentQuestionIndex, option)}>
                            {option}
                        </Button>
                    );
                })}
            </div>
            <div className="mt-6 flex justify-between items-center">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                {
                    currentQuestionIndex === quiz.questions.length - 1 ? (
                        <Button onClick={handleSubmitQuiz}>Finish Quiz</Button>
                    ) : (
                        <Button onClick={handleNextQuestion}>Next</Button>
                    )
                }
            </div>
        </div>
    );
}
