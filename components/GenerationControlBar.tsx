
'use client';

import { useState, useRef } from 'react';
import { useGenerationStore, Tool } from '@/lib/generationStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, FileUp } from 'lucide-react';

// Helper component for tool-specific controls, now connected to the new generation store
const ToolControls = ({ tool }: { tool: Tool }) => {
    const {
        // Summary state from the new store
        summaryLength, setSummaryLength,
        summaryStyle, setSummaryStyle,
        summaryFocus, setSummaryFocus,
        // Quiz state from the new store
        quizQuestionType, setQuizQuestionType,
        quizDifficulty, setQuizDifficulty,
        quizInstantFeedback, setQuizInstantFeedback,
        // Flashcard state from the new store
        flashcardStyle, setFlashcardStyle,
        flashcardIncludeExamples, setFlashcardIncludeExamples,
        // Global loading state
        isLoading,
    } = useGenerationStore();

    if (tool === 'summary') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="summary-length">Length</Label>
                    <Select value={summaryLength} onValueChange={setSummaryLength} disabled={isLoading}>
                        <SelectTrigger id="summary-length"><SelectValue placeholder="Select length" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bullet_points">Bullet Points</SelectItem>
                            <SelectItem value="one_paragraph">One Paragraph</SelectItem>
                            <SelectItem value="conversational">Conversational</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="summary-style">Style</Label>
                    <Select value={summaryStyle} onValueChange={setSummaryStyle} disabled={isLoading}>
                        <SelectTrigger id="summary-style"><SelectValue placeholder="Select style" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="simple">Simple</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="academic">Academic</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="summary-focus">Focus</Label>
                    <Select value={summaryFocus} onValueChange={setSummaryFocus} disabled={isLoading}>
                        <SelectTrigger id="summary-focus"><SelectValue placeholder="Select focus" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="action_items">Action Items</SelectItem>
                            <SelectItem value="key_questions">Key Questions</SelectItem>
                            <SelectItem value="key_terms">Key Terms</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        );
    } else if (tool === 'quiz') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="quiz-question-type">Question Type</Label>
                    <Select value={quizQuestionType} onValueChange={setQuizQuestionType} disabled={isLoading}>
                        <SelectTrigger id="quiz-question-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                            <SelectItem value="open_answer">Open Answer</SelectItem>
                            <SelectItem value="true_false">True/False</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="quiz-difficulty">Difficulty</Label>
                    <Select value={quizDifficulty} onValueChange={setQuizDifficulty} disabled={isLoading}>
                        <SelectTrigger id="quiz-difficulty"><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                    <Switch id="quiz-instant-feedback" checked={quizInstantFeedback} onCheckedChange={setQuizInstantFeedback} disabled={isLoading} />
                    <Label htmlFor="quiz-instant-feedback">Instant Feedback</Label>
                </div>
            </div>
        );
    } else if (tool === 'flashcard') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="flashcard-style">Card Style</Label>
                    <Select value={flashcardStyle} onValueChange={setFlashcardStyle} disabled={isLoading}>
                        <SelectTrigger id="flashcard-style"><SelectValue placeholder="Select style" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="term_definition">Term/Definition</SelectItem>
                            <SelectItem value="question_answer">Question/Answer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                    <Switch id="flashcard-include-examples" checked={flashcardIncludeExamples} onCheckedChange={setFlashcardIncludeExamples} disabled={isLoading} />
                    <Label htmlFor="flashcard-include-examples">Include Examples</Label>
                </div>
            </div>
        );
    }
    return null;
};

export const GenerationControlBar = () => {
    const { activeTool, setActiveTool, setInput, generate, isLoading } = useGenerationStore();
    const [isOpen, setIsOpen] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const text = await file.text();
            setInput(text);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleGenerate = () => {
        generate();
    };

    return (
        <div className="w-full">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-x rounded-t-lg">
                <div className="flex items-center justify-between">
                    <div className="w-1/3">
                        <Select value={activeTool} onValueChange={(value) => setActiveTool(value as Tool)} disabled={isLoading}>
                            <SelectTrigger><SelectValue placeholder="Select a tool" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="summary">Summary</SelectItem>
                                <SelectItem value="quiz">Quiz</SelectItem>
                                <SelectItem value="flashcard">Flashcards</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                            <ChevronsUpDown className="h-5 w-5" />
                        </Button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.md" />
                        <Button variant="ghost" size="icon" onClick={handleImportClick} disabled={isLoading}>
                            <FileUp className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                {isOpen && (
                    <div className="mt-4">
                        <ToolControls tool={activeTool} />
                    </div>
                )}
            </div>
            <div className="flex items-center justify-end p-2 border-x border-b bg-white dark:bg-black rounded-b-lg">
                 <Button onClick={handleGenerate} disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate'}
                </Button>
            </div>
        </div>
    );
};
