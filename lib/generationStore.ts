import { create } from 'zustand';

export type Tool = 'summary' | 'quiz' | 'flashcard';

interface GenerationState {
    activeTool: Tool;
    input: string;
    isLoading: boolean;
    error: string | null;
    summary: string;
    quiz: any; 
    flashcards: any[];

    // Summary options
    summaryLength: string;
    summaryStyle: string;
    summaryFocus: string;

    // Quiz options
    quizQuestionType: string;
    quizDifficulty: string;
    quizInstantFeedback: boolean;

    // Flashcard options
    flashcardStyle: string;
    flashcardIncludeExamples: boolean;

    setActiveTool: (tool: Tool) => void;
    setInput: (input: string) => void;

    // Setters for options
    setSummaryLength: (length: string) => void;
    setSummaryStyle: (style: string) => void;
    setSummaryFocus: (focus: string) => void;
    setQuizQuestionType: (type: string) => void;
    setQuizDifficulty: (difficulty: string) => void;
    setQuizInstantFeedback: (feedback: boolean) => void;
    setFlashcardStyle: (style: string) => void;
    setFlashcardIncludeExamples: (examples: boolean) => void;

    generate: () => Promise<void>;
    clearError: () => void;
}

export const useGenerationStore = create<GenerationState>((set, get) => ({
    activeTool: 'summary',
    input: '',
    isLoading: false,
    error: null,
    summary: '',
    quiz: null,
    flashcards: [],

    // Summary options initial state
    summaryLength: 'bullet_points',
    summaryStyle: 'professional',
    summaryFocus: 'general',

    // Quiz options initial state
    quizQuestionType: 'multiple_choice',
    quizDifficulty: 'medium',
    quizInstantFeedback: true,

    // Flashcard options initial state
    flashcardStyle: 'term_definition',
    flashcardIncludeExamples: true,

    setActiveTool: (tool) => set({ activeTool: tool }),
    setInput: (input) => set({ input }),

    // Setters for options
    setSummaryLength: (length) => set({ summaryLength: length }),
    setSummaryStyle: (style) => set({ summaryStyle: style }),
    setSummaryFocus: (focus) => set({ summaryFocus: focus }),
    setQuizQuestionType: (type) => set({ quizQuestionType: type }),
    setQuizDifficulty: (difficulty) => set({ quizDifficulty: difficulty }),
    setQuizInstantFeedback: (feedback) => set({ quizInstantFeedback: feedback }),
    setFlashcardStyle: (style) => set({ flashcardStyle: style }),
    setFlashcardIncludeExamples: (examples) => set({ flashcardIncludeExamples: examples }),

    generate: async () => {
        const { activeTool, input } = get();
        if (!input) {
            set({ error: "Please enter some text or import a file to generate content." });
            return;
        }

        set({ isLoading: true, error: null });

        const body: { tool: Tool; text: string; [key: string]: any } = {
            tool: activeTool,
            text: input,
        };

        // Add tool-specific options to the request body
        switch (activeTool) {
            case 'summary':
                const { summaryLength, summaryStyle, summaryFocus } = get();
                body.length = summaryLength;
                body.style = summaryStyle;
                body.focus = summaryFocus;
                break;
            case 'quiz':
                const { quizQuestionType, quizDifficulty, quizInstantFeedback } = get();
                body.questionType = quizQuestionType;
                body.difficulty = quizDifficulty;
                body.instantFeedback = quizInstantFeedback;
                break;
            case 'flashcard':
                const { flashcardStyle, flashcardIncludeExamples } = get();
                body.style = flashcardStyle;
                body.includeExamples = flashcardIncludeExamples;
                break;
        }

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An unknown error occurred.');
            }

            const data = await response.json();

            switch (activeTool) {
                case 'summary':
                    set({ summary: data.summary, isLoading: false });
                    break;
                case 'quiz':
                    set({ quiz: data.quiz, isLoading: false });
                    break;
                case 'flashcard':
                    set({ flashcards: data.flashcards, isLoading: false });
                    break;
            }
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },
    clearError: () => set({ error: null }),
}));