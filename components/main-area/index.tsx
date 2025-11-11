
'use client';

import { useUIStore } from '@/lib/store';
import { SummaryTool } from './summary-tool';
import { QuizTool } from '@/components/QuizTool';
import { FlashcardTool } from '@/components/FlashcardTool';
import { ChatInput } from '@/components/ChatInput';
import { GenerationControlBar } from '@/components/GenerationControlBar';

export function MainArea() {
    const { activeTool, summary, quiz, flashcards, animation } = useUIStore();

    const renderTool = () => {
        switch (activeTool) {
            case 'summary':
                return <SummaryTool summary={summary} animation={animation} />;
            case 'quiz':
                return <QuizTool quiz={quiz} />;
            case 'flashcards':
                return <FlashcardTool flashcards={flashcards} />;
            default:
                return <div>Select a tool</div>;
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-2 overflow-y-auto">
                {renderTool()}
            </div>
            <div className="p-2 border-t">
                <GenerationControlBar />
                <ChatInput />
            </div>
        </div>
    );
}
