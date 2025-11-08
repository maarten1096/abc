
'use client';

import { useTheme } from './ThemeProvider';
import ProfileMenu from './ProfileMenu';

const tools = [
  { id: 'summary', name: 'Summary', icon: '🧠' },
  { id: 'quiz', name: 'Quiz', icon: '🧩' },
  { id: 'whiteboard', name: 'Whiteboard', icon: '🖼️' },
];

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
          </ul>
        </nav>
      </div>
      <div className="p-2" style={{borderTop: `1px solid ${theme.accent}`}}>
         <ProfileMenu />
      </div>
    </div>
  );
}
