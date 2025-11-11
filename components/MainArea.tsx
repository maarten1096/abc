
'use client';

import { SummaryTool } from './main-area/summary-tool';
import { QuizTool } from './main-area/quiz-tool';
import { FlashcardTool } from './main-area/flashcard-tool';
import { GenerationControlBar } from './GenerationControlBar';
import { useGenerationStore } from '@/lib/generationStore';
import { ErrorDisplay } from './ErrorDisplay';
import { useTheme } from './ThemeProvider';

const WhiteboardTool = () => <div className="text-white">Whiteboard Tool</div>; // Placeholder

export function MainArea() {
    const { activeTool } = useGenerationStore();
    const { theme } = useTheme();

    return (
        <div className="flex flex-col flex-1 h-screen" style={{ backgroundColor: theme.main }}>
            <ErrorDisplay />
            <div className="flex-1 overflow-y-auto p-8">
                {activeTool === 'summary' && <SummaryTool />}
                {activeTool === 'quiz' && <QuizTool />}
                {activeTool === 'flashcard' && <FlashcardTool />}
                {activeTool === 'whiteboard' && <WhiteboardTool />}
            </div>
            <div className="p-4" style={{ backgroundColor: theme.main, flexShrink: 0 }}>
                <GenerationControlBar />
            </div>
        </div>
    );
}
