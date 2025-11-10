
'use client';

import SummaryTool from './SummaryTool';
import QuizTool from './QuizTool';
import FlashcardTool from './FlashcardTool';
import ChatInput from './ChatInput';
import { useTheme } from './ThemeProvider';

// A placeholder for now
const WhiteboardTool = () => <div>Whiteboard Tool</div>;

export default function MainArea({ activeTool, activeRecent, activeFavorite }: { activeTool: string, activeRecent: number | null, activeFavorite: number | null }) {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col flex-1 h-screen" style={{ backgroundColor: theme.main }}>
      <div className="h-24" style={{ backgroundColor: theme.main, flexShrink: 0 }}></div>
      <div className="flex-1 overflow-y-auto p-8">
        {activeTool === 'summary' && <SummaryTool activeRecent={activeRecent} activeFavorite={activeFavorite} />}
        {activeTool === 'quiz' && <QuizTool activeRecent={activeRecent} activeFavorite={activeFavorite} />}
        {activeTool === 'flashcards' && <FlashcardTool activeRecent={activeRecent} activeFavorite={activeFavorite} />}
        {activeTool === 'whiteboard' && <WhiteboardTool />}
      </div>
      <div className="p-4" style={{ backgroundColor: theme.main, flexShrink: 0 }}>
        <ChatInput />
      </div>
    </div>
  );
}
