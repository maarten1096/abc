
'use client';

import { useUIStore } from '@/lib/store';
import { PenSquare, Book, Zap } from 'lucide-react';

const navItems = [
    { id: 'summary', label: 'Summary', icon: PenSquare },
    { id: 'quiz', label: 'Quiz', icon: Book },
    { id: 'flashcards', label: 'Flashcards', icon: Zap },
];

export function Navigation() {
    const { activeTool, setActiveTool, sidebarCollapsed } = useUIStore();

    return (
        <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTool(item.id)}
                    className={`flex items-center w-full p-2 text-left rounded-md hover:bg-gray-200 ${activeTool === item.id ? 'bg-gray-200' : ''}`}>
                    <item.icon className="w-6 h-6" />
                    {!sidebarCollapsed && <span className="ml-4">{item.label}</span>}
                </button>
            ))}
        </nav>
    );
}
