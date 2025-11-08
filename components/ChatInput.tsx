
'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

export default function ChatInput() {
  const [text, setText] = useState('');
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Submit the form
      console.log('Submitting:', text);
      setText('');
    }
  };

  return (
    <div className="p-4" style={{ backgroundColor: theme.main }}>
      <textarea
        ref={textareaRef}
        className="w-full p-2 rounded-md resize-none overflow-y-auto bg-transparent"
        style={{
          border: `1.5px solid ${theme.accent}`,
          color: theme.accent,
          maxHeight: '12rem', // 6 lines
        }}
        placeholder="Type your message..."
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
      />
    </div>
  );
}
