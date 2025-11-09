
'use client';

import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setPreset } = useTheme();
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-4 text-left w-full">
        {user ? (
          <>
            <div className="text-sm">{user.email}</div>
            <div className="text-xs text-gray-400">Free</div>
          </>
        ) : (
          <div className="text-sm">Guest</div>
        )}
      </button>
      {isOpen && (
        <div className="absolute bottom-full mb-2 w-56 rounded-md bg-main shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {user ? (
              <>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">{user.email}</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Upgrade Plan</a>
                <div className="border-t border-gray-200 my-1"></div>
              </>
            ) : null}
            <div className="px-4 py-2 text-sm text-gray-500">Theme</div>
            <button onClick={() => setPreset('light')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Light</button>
            <button onClick={() => setPreset('dark')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dark</button>
            <div className="border-t border-gray-200 my-1"></div>
            {user ? (
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Logout</button>
            ) : (
              <button onClick={handleLogin} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Login</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
