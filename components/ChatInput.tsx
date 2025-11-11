
'use client';

import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from '@/components/ui/button';
import { CornerDownLeft } from 'lucide-react';
import { useUIStore } from '@/lib/store';

export function ChatInput() {
  const {
    inputText, setInputText, activeTool,
    setSummary, setQuiz, setFlashcards,
  } = useUIStore();

  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);

    // Use the activeTool from the store directly
    const currentTool = useUIStore.getState().activeTool;

    // Clear previous results
    if (currentTool === 'summary') setSummary('');
    if (currentTool === 'quiz') setQuiz({ questions: [] });
    if (currentTool === 'flashcards') setFlashcards({ cards: [] });

    try {
        const state = useUIStore.getState();
        let options = {};

        switch (currentTool) {
            case 'summary':
                options = {
                    length: state.summaryLength,
                    style: state.summaryStyle,
                    focus: state.summaryFocus,
                };
                break;
            case 'quiz':
                options = {
                    questionType: state.quizQuestionType,
                    difficulty: state.quizDifficulty,
                    instantFeedback: state.quizInstantFeedback,
                };
                break;
            case 'flashcards':
                options = {
                    style: state.flashcardStyle,
                    includeExamples: state.flashcardIncludeExamples,
                };
                break;
        }

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: inputText,
                tool: currentTool,
                options: options,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An unknown error occurred');
        }

        const result = await response.json();

        if (currentTool === 'summary') {
            setSummary(result.summary);
        } else if (currentTool === 'quiz') {
            setQuiz(result);
        } else if (currentTool === 'flashcards') {
            setFlashcards(result);
        }

    } catch (error) {
        console.error('Failed to generate content:', error);
        const errorMessage = `Error: Could not generate ${currentTool}. ${(error as Error).message}`;
        if (currentTool === 'summary') {
            setSummary(errorMessage);
        } else if (currentTool === 'quiz') {
            // Display error in the quiz UI
            setQuiz({ questions: [{ question: errorMessage, answer: '' }] });
        } else if (currentTool === 'flashcards') {
            // Display error in the flashcards UI
            setFlashcards({ cards: [{ front: errorMessage, back: '' }] });
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="relative flex w-full">
        <TextareaAutosize
            maxRows={15}
            minRows={1}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Enter text to use with ${activeTool}...`}
            spellCheck={false}
            value={inputText}
            className="w-full resize-none rounded-md border border-input bg-transparent p-3 pr-14 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            disabled={isLoading}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                }
            }}
        />
        <Button size="icon" type="submit" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={handleGenerate} disabled={isLoading || !inputText.trim()}>
            <CornerDownLeft className="size-5" />
        </Button>
    </div>
  );
}
