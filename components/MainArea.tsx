'use client';

import SummaryTool from './SummaryTool';
import QuizTool from './QuizTool';
import ChatInput from './ChatInput';
import { useTheme } from './ThemeProvider';

// A placeholder for now
const WhiteboardTool = () => <div>Whiteboard Tool</div>;

export default function MainArea({ activeTool }: { activeTool: string }) {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col h-full">
      <div className="h-24" style={{ backgroundColor: theme.main }}></div>
      <main className="flex-1 p-8" style={{ backgroundColor: theme.main }}>
        {activeTool === 'summary' && <SummaryTool />}
        {activeTool === 'quiz' && <QuizTool />}
        {activeTool === 'whiteboard' && <WhiteboardTool />}
      </main>
      <ChatInput />
    </div>
  );
}
