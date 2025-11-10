
'use client';

import { useTheme } from './ThemeProvider';
import { useState } from 'react';

export default function ProfileMenu() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  // TODO: Get user from Supabase
  const user = {
    name: 'John B.',
    tier: 'Free',
    email: 'john.bahnhoff@example.com'
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-4 focus:outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium" style={{ color: theme.accent }}>{user.name}</span>
          <span className="text-xs" style={{ color: theme.accent }}>{user.tier}</span>
        </div>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5" style={{ backgroundColor: theme.sidebar }}>
          <div className="px-4 py-2 text-xs text-gray-400">{user.email}</div>
          <a href="#" className="block px-4 py-2 text-sm" style={{ color: theme.accent }}>Upgrade Plan</a>
          <a href="#" className="block px-4 py-2 text-sm" style={{ color: theme.accent }}>Customization</a>
          <a href="#" className="block px-4 py-2 text-sm" style={{ color: theme.accent }}>Settings</a>
          <a href="#" className="block px-4 py-2 text-sm" style={{ color: theme.accent }}>Help</a>
          <a href="#" className="block px-4 py-2 text-sm" style={{ color: theme.accent }}>Logout</a>
        </div>
      )}
    </div>
  );
}
