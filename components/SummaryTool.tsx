
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

export default function SummaryTool() {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  // Mock AI response
  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setSummary(
          'This is a summary of your document. It is very insightful and will help you learn a lot.'
        );
        setIsLoading(false);
      }, 2000);
    }
  }, [isLoading]);

  const handleSummarize = () => {
    setIsLoading(true);
    setSummary('');
  };

  return (
    <div className="flex flex-col h-full" style={{ color: theme.accent }}>
        <div className="flex-1 overflow-y-auto p-4 rounded-md" style={{ backgroundColor: theme.sidebar, color: theme.accent}}>
        {isLoading && <p>AI is typing...</p>}
        {summary ? (
          <p>{summary}</p>
        ) : (
          !isLoading && <p className="text-gray-500">The summary will appear here.</p>
        )}
      </div>
      <button 
        onClick={handleSummarize}
        className="mt-4 p-2 rounded-md" 
        style={{ backgroundColor: theme.accent, color: theme.sidebar }}>
        Summarize
        </button>
    </div>
  );
}
