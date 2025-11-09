
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import ProfileMenu from './ProfileMenu';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

const tools = [
  { id: 'summary', name: 'Summary', icon: '🧠' },
  { id: 'quiz', name: 'Quiz', icon: '🧩' },
  { id: 'whiteboard', name: 'Whiteboard', icon: '🖼️' },
  { id: 'search', name: 'Search', icon: '🔍' },
];

interface Recent {
    id: string;
    title: string;
    type: string;
}

export default function Sidebar({
  isCollapsed,
  toggleSidebar,
  activeTool,
  setActiveTool,
}: {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  activeTool: string;
  setActiveTool: (tool: string) => void;
}) {
  const { theme } = useTheme();
  const [session, setSession] = useState<Session | null>(null);
  const [recents, setRecents] = useState<Recent[]>([]);
  const [loadingRecents, setLoadingRecents] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchRecents = async () => {
      setLoadingRecents(true);
      if (session?.user) {
        const { data, error } = await supabase
          .from('recents')
          .select('id, title, type')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        if (error) {
          console.error('Error fetching recents:', error);
        } else {
          setRecents(data as Recent[]);
        }
      } else {
        const localRecents = JSON.parse(localStorage.getItem('recents') || '[]');
        setRecents(localRecents.slice(0, 10));
      }
      setLoadingRecents(false);
    };

    fetchRecents();
  }, [session]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  return (
    <div
      className={`flex flex-col text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
      style={{ backgroundColor: theme.sidebar }}
    >
      <div className="flex-1">
        <button onClick={toggleSidebar} className="p-4 h-16 flex items-center justify-center">
          <span style={{ color: theme.accent }}>{isCollapsed ? '☰' : '✕'}</span>
        </button>
        <nav className="mt-4">
          <ul>
            <li className="px-4 py-2">
              <h2 className={`font-bold text-lg ${isCollapsed ? 'hidden' : 'block'}`} style={{ color: theme.accent }}>Tools</h2>
              <ul className="mt-2">
                {tools.map(tool => (
                  <li key={tool.id} 
                      className={`rounded-md transition-colors duration-200 ${activeTool === tool.id ? 'bg-accent' : ''}`}>
                    <button 
                      onClick={() => setActiveTool(tool.id)} 
                      className="w-full flex items-center p-2" 
                      style={{ color: activeTool === tool.id ? theme.sidebar : theme.accent }}
                    >
                      <span className="text-2xl">{tool.icon}</span>
                      <span className={`ml-4 ${isCollapsed ? 'hidden' : 'block'}`}>{tool.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
            <li className="px-4 py-2 mt-4">
                <h2 className={`font-bold text-lg ${isCollapsed ? 'hidden' : 'block'}`} style={{ color: theme.accent }}>Recents</h2>
                <ul className='mt-2'>
                    {loadingRecents ? (
                        <li className={`p-2 ${isCollapsed ? 'hidden' : 'block'}`} style={{color: theme.accent}}>Loading...</li>
                    ) : (
                        recents.map(recent => (
                            <li key={recent.id}>
                                <button className='w-full flex items-center p-2 text-sm' style={{color: theme.accent}}>
                                    <span className='text-lg'>{recent.type === 'chat' ? '💬' : '📝'}</span>
                                    <span className={`ml-4 truncate ${isCollapsed ? 'hidden' : 'block'}`}>{recent.title}</span>
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </li>
          </ul>
        </nav>
      </div>
      <div className="p-2" style={{borderTop: `1px solid ${theme.accent}`}}>
         {session ? (
            <ProfileMenu />
         ) : (
            <button onClick={handleLogin} className={`w-full flex items-center p-2 rounded-md transition-colors duration-200`} style={{ color: theme.accent }}>
                <span className="text-2xl">➡️</span>
                <span className={`ml-4 ${isCollapsed ? 'hidden' : 'block'}`}>Login</span>
            </button>
         )}
      </div>
    </div>
  );
}
