
'use client';

import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import ProfileMenu from './ProfileMenu';
import { FiFileText, FiMessageSquare, FiGrid, FiMenu, FiX, FiChevronRight, FiTool, FiClock, FiBook, FiSettings } from 'react-icons/fi';

const tools = [
  { id: 'summary', name: 'Summary', icon: <FiFileText /> },
  { id: 'quiz', name: 'Quiz', icon: <FiMessageSquare /> },
  { id: 'flashcards', name: 'Flashcards', icon: <FiGrid /> },
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
  const [activeSection, setActiveSection] = useState('tools');

  const renderSection = (id: string, name: string, icon: React.ReactNode, content: React.ReactNode) => (
    <li>
      <button onClick={() => setActiveSection(activeSection === id ? '' : id)} className="w-full flex items-center justify-between p-2">
          <div className="flex items-center">
            <span className="text-xl" style={{ color: theme.accent }}>{icon}</span>
            {!isCollapsed && <span className="ml-4 font-bold" style={{ color: theme.accent }}>{name}</span>}
          </div>
          {!isCollapsed && <FiChevronRight className={`transform transition-transform duration-200 ${activeSection === id ? 'rotate-90' : ''}`} style={{ color: theme.accent }}/>}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${activeSection === id ? 'max-h-screen' : 'max-h-0'}`}>
        {!isCollapsed && content}
      </div>
    </li>
  );

  const toolsContent = (
    <ul className="pt-2">
      {tools.map(tool => (
        <li key={tool.id}
            className={`rounded-md transition-colors duration-200 mx-2 ${activeTool === tool.id ? 'bg-accent' : ''}`}>
          <button
            onClick={() => setActiveTool(tool.id)}
            className="w-full flex items-center p-2"
            style={{ color: activeTool === tool.id ? theme.sidebar : theme.accent }}
          >
            <span className="text-xl">{tool.icon}</span>
            <span className="ml-4">{tool.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`flex flex-col text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
      style={{ backgroundColor: theme.sidebar }}
    >
        <div className="flex-1 overflow-y-auto no-scrollbar">
            <button onClick={toggleSidebar} className="p-4 h-16 flex items-center w-full justify-center">
              <span style={{ color: theme.accent }} className="text-2xl">{isCollapsed ? <FiMenu /> : <FiX />}</span>
            </button>
            <nav>
            <ul className="space-y-2">
                {renderSection('tools', 'Tools', <FiTool />, toolsContent)}
                {renderSection('classes', 'Classes', <FiBook />, <div className="p-2 text-sm" style={{color: theme.accent}}>Coming soon!</div>)}
                {renderSection('agenda', 'Agenda', <FiClock />, <div className="p-2 text-sm" style={{color: theme.accent}}>Coming soon!</div>)}
            </ul>
            </nav>
        </div>
        <div className="p-2" style={{borderTop: `1px solid ${theme.accent}`}}>
            <ProfileMenu isCollapsed={isCollapsed} />
        </div>
    </div>
  );
}
