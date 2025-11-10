
'use client';

import { Sidebar } from '@/components/sidebar';
import { MainArea } from '@/components/main-area';
import { useUIStore } from '@/lib/store';

export default function Home() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <main className="flex h-screen bg-white">
        <Sidebar />
        <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
            <MainArea />
        </div>
    </main>
  );
}
