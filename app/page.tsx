
'use client';

import { Sidebar } from '@/components/sidebar';
import { MainArea } from '@/components/main-area';
import { useUIStore } from '@/lib/store';
import { ChatInput } from '@/components/ChatInput';

export default function Home() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <main className="flex h-screen bg-white">
        <Sidebar />
        <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
            <div className="flex-1 p-4">
                <MainArea />
            </div>
            <div className="p-4">
                <ChatInput />
            </div>
        </div>
    </main>
  );
}
