
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import ProfileMenu from './ProfileMenu';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

// Placeholder icons - we'll replace these with a proper library later
const icons = {
  summary: 'S',
  quiz: 'Q',
  flashcards: 'F',
  whiteboard: 'W',
  search: '?',
  tools: 'T',
  classes: 'C',
  agenda: 'A',
  recents: 'R',
  add: '+',
  searchRecents: '?_',
  login: '→',
  menu: '☰',
  close: '✕',
  arrow: '>'
};

const tools = [
  { id: 'summary', name: 'Summary', icon: icons.summary },
  { id: 'quiz', name: 'Quiz', icon: icons.quiz },
  { id: 'flashcards', name: 'Flashcards', icon: icons.flashcards },
];

interface Recent {
    id: string;
    title: string;
    tool: string;
    created_at: string;
}

const timeAgo = (date: string) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + "y ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + "mo ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + "d ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + "h ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + "m ago";
    }
    return Math.floor(seconds) + "s ago";
};

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
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('tools');


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
          .select('id, title, tool, created_at')
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


  const filteredRecents = recents.filter(recent =>
    recent.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSection = (id: string, name: string, icon: string, content: React.ReactNode) => (
    <li className="px-4 py-2">
      <button onClick={() => setActiveSection(activeSection === id ? '' : id)} className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl" style={{ color: theme.accent }}>{icon}</span>
            <span className={`ml-4 font-bold text-lg ${isCollapsed ? 'hidden' : 'block'}`} style={{ color: theme.accent }}>{name}</span>
          </div>
          <span className={`transform transition-transform duration-200 ${activeSection === id ? 'rotate-90' : ''} ${isCollapsed ? 'hidden' : 'block'}`} style={{ color: theme.accent }}>{icons.arrow}</span>
      </button>
      <div className={`mt-2 overflow-hidden transition-all duration-300 ${activeSection === id ? 'max-h-screen' : 'max-h-0'}`}>
        {content}
      </div>
    </li>
  );


  const toolsContent = (
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
  );

  const recentsContent = (
    <>
    <div className={`flex items-center justify-between ${isCollapsed ? 'hidden' : 'block'}`}>
        <div>
            <button onClick={() => {}} className={'p-1 rounded-md'} style={{ color: theme.accent }}>
                <span>{icons.add}</span>
            </button>
            <button onClick={() => setSearchVisible(!searchVisible)} className={'p-1 rounded-md'} style={{ color: theme.accent }}>
                <span>{icons.searchRecents}</span>
            </button>
        </div>
    </div>
    {searchVisible && !isCollapsed && (
        <input
            type="text"
            placeholder="Search recents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-1 mt-2 rounded-md bg-transparent"
            style={{ border: `1.5px solid ${theme.accent}`, color: theme.accent }}
        />
    )}
    <ul className='mt-2'>
        {loadingRecents ? (
            <li className={`p-2 ${isCollapsed ? 'hidden' : 'block'}`} style={{color: theme.accent}}>Loading...</li>
        ) : (
            filteredRecents.map(recent => (
            <li key={recent.id}>
                <button className='w-full flex flex-col items-start p-2 text-sm' style={{color: theme.accent}} onClick={() => console.log("Clicked recent:", recent)}>
                <div className="flex items-center">
                    <span className='text-lg'>{recent.tool === 'summary' ? icons.summary : recent.tool === 'quiz' ? icons.quiz : icons.flashcards}</span>
                    <span className={`ml-4 font-bold truncate ${isCollapsed ? 'hidden' : 'block'}`}>{recent.title}</span>
                </div>
                <div className={`ml-10 text-xs ${isCollapsed ? 'hidden' : 'block'}`}>
                    <span>({recent.tool})</span>
                    <span className="ml-2">{timeAgo(recent.created_at)}</span>
                </div>
                </button>
            </li>
            ))
        )}
    </ul>
    </>
  );


  return (
    <div
      className={`flex flex-col text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
      style={{ backgroundColor: theme.sidebar }}
    >
        <div className="flex-1 overflow-y-auto no-scrollbar">
            <button onClick={toggleSidebar} className="p-4 h-16 flex items-center justify-center">
            <span style={{ color: theme.accent }}>{isCollapsed ? icons.menu : icons.close}</span>
            </button>
            <nav className="mt-4">
            <ul>
                {renderSection('tools', 'Tools', icons.tools, toolsContent)}
                {renderSection('recents', 'Recents', icons.recents, recentsContent)}
                {renderSection('classes', 'Classes', icons.classes, <div className={`p-2 ${isCollapsed ? 'hidden' : 'block'}`} style={{color: theme.accent}}>Coming soon!</div>)}
                {renderSection('agenda', 'Agenda', icons.agenda, <div className={`p-2 ${isCollapsed ? 'hidden' : 'block'}`} style={{color: theme.accent}}>Coming soon!</div>)}
            </ul>
            </nav>
        </div>
        <div className="p-2" style={{borderTop: `1px solid ${theme.accent}`}}>
            <ProfileMenu />
        </div>
    </div>
  );
}
