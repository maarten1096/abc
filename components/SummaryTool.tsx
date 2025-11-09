
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function SummaryTool() {
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const handleSubmit = async () => {
    if (!session) {
      alert('Please log in to use this feature.');
      return;
    }
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
          userId: session.user.id,
        }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <h3 className="text-lg font-bold mb-2" style={{ color: theme.accent }}>Summary</h3>
          <p style={{ color: theme.accent }}>{summary}</p>
        </div>
      )}
    </div>
  );
}
