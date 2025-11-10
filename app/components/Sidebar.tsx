// app/components/Sidebar.tsx
"use client";
import React from "react";
import { BookOpen, FileText, List, PlusSquare, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function Sidebar({ active }: { active?: string }) {
  const items = [
    { id: "new", label: "New", icon: PlusSquare, href: "/" },
    { id: "flashcards", label: "Flashcards", icon: BookOpen, href: "/flashcards" },
    { id: "recents", label: "Recents", icon: List, href: "/recents" },
    { id: "import", label: "Import", icon: UploadCloud, href: "/import" },
    { id: "summary", label: "Summary", icon: FileText, href: "/mode/summary" },
  ];
  return (
    <nav className="w-20 bg-slate-50 dark:bg-slate-900 border-r">
      <div className="p-3 flex flex-col items-center gap-3">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = it.id === active;
          return (
            <Link
              key={it.id}
              href={it.href}
              className={`w-12 h-12 flex items-center justify-center rounded-xl ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={18} strokeWidth={1.5} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
