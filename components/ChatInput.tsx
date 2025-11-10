
'use client';

import { useChat } from 'ai/react';
import { useTheme } from './ThemeProvider';
import { useRef, useEffect, useState } from 'react';
import { ArrowUp, Paperclip } from 'lucide-react';

export default function ChatInput() {
  const { append } = useChat();
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    append({ role: 'user', content: input });
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4" style={{ backgroundColor: theme.main }}>
      <div 
        className="flex items-center p-2 rounded-lg"
        style={{ border: `1.5px solid ${theme.accent}` }}
      >
        <button type="button" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full">
          <Paperclip size={20} style={{ color: theme.accent }}/>
        </button>
        <textarea
          ref={textareaRef}
          className="flex-1 p-2 bg-transparent resize-none overflow-y-auto focus:outline-none"
          style={{
            color: theme.accent,
            maxHeight: '12rem', // approx 6 lines
          }}
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button type="submit" className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full">
          <ArrowUp size={20} className="text-white" />
        </button>
      </div>
    </form>
  );
}
