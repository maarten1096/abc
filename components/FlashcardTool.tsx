
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { FiStar } from 'react-icons/fi';

export default function FlashcardTool({ activeRecent, activeFavorite }: { activeRecent: number | null, activeFavorite: number | null }) {
  const { theme } = useTheme();
  const [session, setSession] = useState<Session | null>(null);
  const [amount, setAmount] = useState(10);
  const [style, setStyle] = useState('qa');
  const [includePictures, setIncludePictures] = useState(false);
  const [spacedRepetition, setSpacedRepetition] = useState(true);
  const [gamifiedMode, setGamifiedMode] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<any[] | null>(null);
  const [flashcardId, setFlashcardId] = useState<number | null>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const localFlashcards = localStorage.getItem('flashcards');
    if (localFlashcards) {
      setFlashcards(JSON.parse(localFlashcards));
    }
  }, []);

  useEffect(() => {
    const fetchFlashcards = async (id: number) => {
        setLoading(true);
        const { data, error } = await supabase
          .from('flashcards')
          .select('title, flashcards')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching flashcards:', error);
        } else {
          setFlashcards(data.flashcards.flashcards);
          setTitle(data.title);
        }
        setLoading(false);
    };

    if (activeRecent) {
      fetchFlashcards(activeRecent);
    }
    if (activeFavorite) {
        fetchFlashcards(activeFavorite);
    }
  }, [activeRecent, activeFavorite]);

  const handleSubmit = async () => {
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
          userId: session?.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      setFlashcards(data.flashcards.flashcards);
      setTitle(data.title);
      setFlashcardId(data.id);

      if (!session) {
        localStorage.setItem('flashcards', JSON.stringify(data.flashcards.flashcards));
      } else {
        await supabase.from('recents').insert({
            user_id: session.user.id,
            title: data.title,
            tool: 'flashcards',
            tool_id: data.id,
        });
      }
    } catch (error) {
      console.error(error);
      // Handle error state in the UI
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (session && flashcardId) {
        const { error } = await supabase.from('favorites').insert({
            user_id: session.user.id,
            title,
            tool: 'flashcards',
            tool_id: flashcardId,
        });
        if (error) {
            console.error('Error favoriting flashcards:', error);
        }
    }
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-4" style={{ color: theme.accent }}>
        <div className="flex flex-col">
          <label className="text-sm">Amount</label>
          <input type="number" min="5" max="50" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} style={{ backgroundColor: theme.main, border: `1.5px solid ${theme.accent}` }}/>
        </div>
        <div className="flex flex-col">
          <label className="text-sm">Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)} style={{ backgroundColor: theme.main, border: `1.5px solid ${theme.accent}` }}>
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold" style={{ color: theme.accent }}>{title}</h2>
            {session && <button onClick={handleFavorite} style={{ color: theme.accent }}><FiStar /></button>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcards.map((card, index) => (
              <div key={index} className="p-4 rounded-md" style={{ border: `1.5px solid ${theme.accent}` }}>
                <p className="font-bold" style={{ color: theme.accent }}>Front:</p>
                <p style={{ color: theme.accent }}>{card.front}</p>
                <p className="font-bold mt-2" style={{ color: theme.accent }}>Back:</p>
                <p style={{ color: theme.accent }}>{card.back}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
