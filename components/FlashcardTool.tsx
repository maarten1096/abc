
'use client';

import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { useUser } from '@supabase/auth-helpers-react';

export default function FlashcardTool() {
  const { theme } = useTheme();
  const user = useUser();
  const [amount, setAmount] = useState(10);
  const [style, setStyle] = useState('qa');
  const [includePictures, setIncludePictures] = useState(false);
  const [spacedRepetition, setSpacedRepetition] = useState(true);
  const [gamifiedMode, setGamifiedMode] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<any[] | null>(null);
  const [title, setTitle] = useState('');

  const handleSubmit = async () => {
    if (!user) {
      // Handle case where user is not logged in
      return;
    }
    setLoading(true);
    setFlashcards(null);
    setTitle('');

    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          amount,
          style,
          includePictures,
          spacedRepetition,
          gamifiedMode,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      setFlashcards(data.flashcards.flashcards);
      setTitle(data.title);
    } catch (error) {
      console.error(error);
      // Handle error state in the UI
    } finally {
      setLoading(false);
    }
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
      <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 rounded-md" style={{ backgroundColor: theme.accent, color: theme.main }}>
        {loading ? 'Generating...' : 'Generate Flashcards'}
      </button>

      {flashcards && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcards.map((card, index) => (
              <div key={index} className="p-4 rounded-md" style={{ border: `1.5px solid ${theme.accent}` }}>
                <p className="font-bold">Front:</p>
                <p>{card.front}</p>
                <p className="font-bold mt-2">Back:</p>
                <p>{card.back}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
