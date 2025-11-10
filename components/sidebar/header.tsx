
'use client';

import { useUIStore } from '@/lib/store';
import { ChevronLeft } from 'lucide-react';

export function Header() {
    const { sidebarCollapsed, toggleSidebar } = useUIStore();

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!sidebarCollapsed && (
                <div className="text-lg font-bold">MyApp</div>
            )}
            <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-200">
                <ChevronLeft className={`w-6 h-6 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
        </div>
    );
}
