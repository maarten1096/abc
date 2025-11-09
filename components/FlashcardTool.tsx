
'use client';

import { useState } from 'react';
import { useTheme } from './ThemeProvider';

export default function FlashcardTool() {
  const { theme } = useTheme();
  const [amount, setAmount] = useState(10);
  const [style, setStyle] = useState('qa');
  const [includePictures, setIncludePictures] = useState(false);
  const [spacedRepetition, setSpacedRepetition] = useState(true);
  const [gamifiedMode, setGamifiedMode] = useState(false);
  const [text, setText] = useState('');

  const handleSubmit = () => {
    // AI logic to generate flashcards will go here
    console.log({ amount, style, includePictures, spacedRepetition, gamifiedMode, text });
  };

  return (
    <div>
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm">Amount</label>
          <input type="number" min="5" max="50" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm">Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="qa">Q&A</option>
            <option value="term-definition">Term/Definition</option>
          </select>
        </div>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={includePictures} onChange={() => setIncludePictures(!includePictures)} />
          <span>Include Pictures</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={spacedRepetition} onChange={() => setSpacedRepetition(!spacedRepetition)} />
          <span>Spaced Repetition</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={gamifiedMode} onChange={() => setGamifiedMode(!gamifiedMode)} />
          <span>Gamified Mode</span>
        </label>
      </div>
      <textarea
        className="w-full p-2 rounded-md resize-none overflow-y-auto bg-transparent mb-4"
        style={{ border: `1.5px solid ${theme.accent}`, color: theme.accent }}
        placeholder="Enter text to generate flashcards from..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />
      <button onClick={handleSubmit} className="px-4 py-2 rounded-md" style={{ backgroundColor: theme.accent, color: theme.main }}>
        Generate Flashcards
      </button>
    </div>
  );
}
