
'use client';
import React, { useState } from 'react';
import { BookOpen, FileText, List, PlusSquare, UploadCloud, ChevronsRight, ChevronsLeft, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Tool } from '@/app/page';

export default function Sidebar({ active, setActive }: { active?: string, setActive: (tool: Tool) => void }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const items = [
    { id: 'new', label: 'New', icon: PlusSquare, href: '/' },
    { id: 'summary', label: 'Summary', icon: FileText, href: '/mode/summary' },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle, href: '/mode/quiz' },
    { id: 'flashcards', label: 'Flashcards', icon: BookOpen, href: '/flashcards' },
    { id: 'recents', label: 'Recents', icon: List, href: '/recents' },
    { id: 'import', label: 'Import', icon: UploadCloud, href: '/import' },
  ];

  const handleItemClick = (id: Tool) => {
    setActive(id);
  };

  return (
    <nav className={`bg-slate-50 dark:bg-slate-900 border-r transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-3 flex flex-col items-center gap-3">
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl mb-4">
          {isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = it.id === active;
          return (
            <button
              key={it.id}
              onClick={() => handleItemClick(it.id as Tool)}
              className={`w-full h-12 flex items-center justify-start rounded-xl p-3 transition-colors duration-200 ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}>
              <Icon size={18} strokeWidth={1.5} />
              {!isCollapsed && <span className="ml-4 text-sm font-medium">{it.label}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
