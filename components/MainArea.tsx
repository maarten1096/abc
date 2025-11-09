
'use client';

import { useEffect, useState } from 'react';
import SummaryTool from './SummaryTool';
import QuizTool from './QuizTool';
import ChatInput from './ChatInput';
import Search from './Search';
import { useTheme } from './ThemeProvider';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

// A placeholder for now
const WhiteboardTool = () => <div>Whiteboard Tool</div>;

export default function MainArea({ activeTool }: { activeTool: string }) {
  const { theme } = useTheme();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        mergeLocalData(session.user.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        mergeLocalData(session.user.id);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const mergeLocalData = async (userId: string) => {
    const localRecents = JSON.parse(localStorage.getItem('recents') || '[]');
    if (localRecents.length > 0) {
      const recentsToInsert = localRecents.map((recent: any) => ({
        ...recent,
        user_id: userId,
      }));

      const { error } = await supabase.from('recents').insert(recentsToInsert);
      if (error) {
        console.error('Error merging local data:', error);
      } else {
        localStorage.removeItem('recents');
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="h-24" style={{ backgroundColor: theme.main }}></div>
      <main className="flex-1 p-8" style={{ backgroundColor: theme.main }}>
        {activeTool === 'summary' && <SummaryTool />}
        {activeTool === 'quiz' && <QuizTool />}
        {activeTool === 'whiteboard' && <WhiteboardTool />}
        {activeTool === 'search' && <Search />}
      </main>
      <ChatInput />
    </div>
  );
}
