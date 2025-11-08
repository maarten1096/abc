'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MainArea from '@/components/MainArea';
import { useTheme } from '@/components/ThemeProvider';

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTool, setActiveTool] = useState('summary');
  const { theme } = useTheme();

  return (
    <div className="flex h-screen" style={{ backgroundColor: theme.main }}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
      />
      <div className="flex flex-col flex-1">
        <MainArea activeTool={activeTool} />
      </div>
    </div>
  );
}
