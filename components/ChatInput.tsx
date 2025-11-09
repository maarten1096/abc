
'use client';

import { useChat } from 'ai/react';
import { useTheme } from './ThemeProvider';
import { useRef, useEffect } from 'react';

export default function ChatInput() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div>
      <div style={{ backgroundColor: theme.main, color: theme.accent }}>
        {messages.map(m => (
          <div key={m.id}>
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4" style={{ backgroundColor: theme.main }}>
        <textarea
          ref={textareaRef}
          className="w-full p-2 rounded-md resize-none overflow-y-auto bg-transparent"
          style={{
            border: `1.5px solid ${theme.accent}`,
            color: theme.accent,
            maxHeight: '12rem', // 6 lines
          }}
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          rows={1}
        />
      </form>
    </div>
  );
}
