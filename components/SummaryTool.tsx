
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { FiStar } from 'react-icons/fi';

export default function SummaryTool({ activeRecent, activeFavorite }: { activeRecent: number | null, activeFavorite: number | null }) {
  const { theme } = useTheme();
  const [session, setSession] = useState<Session | null>(null);
  const [detailLevel, setDetailLevel] = useState('medium');
  const [format, setFormat] = useState('paragraphs');
  const [tone, setTone] = useState('neutral');
  const [includeTldr, setIncludeTldr] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState('smooth');
  const [saveAutomatically, setSaveAutomatically] = useState(false);
  const [highlightKeyTerms, setHighlightKeyTerms] = useState(false);
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [summaryId, setSummaryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const localSummary = localStorage.getItem('summary');
    if (localSummary) {
      setSummary(localSummary);
    }
  }, []);

  useEffect(() => {
    const fetchSummary = async (id: number) => {
      setLoading(true);
      const { data, error } = await supabase
        .from('summaries')
        .select('content')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching summary:', error);
      } else {
        setSummary(data.content);
      }
      setLoading(false);
    };

    if (activeRecent) {
      fetchSummary(activeRecent);
    }
    if (activeFavorite) {
        fetchSummary(activeFavorite);
    }
  }, [activeRecent, activeFavorite]);

  const handleSubmit = async () => {
    setLoading(true);
    setSummary('');
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          detailLevel,
          format,
          tone,
          includeTldr,
          userId: session?.user.id,
        }),
      });
      const data = await response.json();
      setSummary(data.summary);
      setSummaryId(data.id);

      if (!session) {
        localStorage.setItem('summary', data.summary);
      } else {
        // Add to recents
        await supabase.from('recents').insert({
            user_id: session.user.id,
            title: data.summary.slice(0, 30) + '...',
            tool: 'summary',
            tool_id: data.id,
        });
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (session && summaryId) {
        const { error } = await supabase.from('favorites').insert({
            user_id: session.user.id,
            title: summary.slice(0, 30) + '...',
            tool: 'summary',
            tool_id: summaryId,
        });
        if (error) {
            console.error('Error favoriting summary:', error);
        }
    }
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-4">
        {/* ... your options form ... */}
      </div>
      <textarea
        className="w-full p-2 rounded-md resize-none overflow-y-auto bg-transparent mb-4"
        style={{ border: `1.5px solid ${theme.accent}`, color: theme.accent }}
        placeholder="Enter text to summarize..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />
      <button onClick={handleSubmit} className="px-4 py-2 rounded-md" style={{ backgroundColor: theme.accent, color: theme.main }} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Summary'}
      </button>
      {summary && (
        <div className="mt-8 p-4 rounded-md" style={{ border: `1.5px solid ${theme.accent}` }}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold" style={{ color: theme.accent }}>Summary</h3>
            {session && <button onClick={handleFavorite}><FiStar /></button>}
          </div>
          <p style={{ color: theme.accent }}>{summary}</p>
        </div>
      )}
    </div>
  );
}
