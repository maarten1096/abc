
'use client';

import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setPreset } = useTheme();

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-4 text-left w-full">
        <div className="text-sm">John B.</div>
        <div className="text-xs text-gray-400">Free</div>
      </button>
      {isOpen && (
        <div className="absolute bottom-full mb-2 w-56 rounded-md bg-main shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">john.b@example.com</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Upgrade Plan</a>
            <div className="border-t border-gray-200 my-1"></div>
            <div className="px-4 py-2 text-sm text-gray-500">Theme</div>
            <button onClick={() => setPreset('light')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Light</button>
            <button onClick={() => setPreset('dark')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dark</button>
            <div className="border-t border-gray-200 my-1"></div>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Logout</a>
          </div>
        </div>
      )}
    </div>
  );
}
