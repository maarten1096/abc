
'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainArea from '../components/MainArea';
import { ThemeProvider } from '../components/ThemeProvider';

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTool, setActiveTool] = useState('summary');

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
        />
        <MainArea activeTool={activeTool} />
      </div>
    </ThemeProvider>
  );
}

