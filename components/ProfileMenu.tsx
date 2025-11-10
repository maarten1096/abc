
'use client';

import { useTheme } from './ThemeProvider';
import { useState, useEffect } from 'react';
import { FiUser, FiLogIn } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function ProfileMenu({ isCollapsed }: { isCollapsed: boolean }) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
  };

  const handleLogin = () => {
    // Redirect to a login page or open a login modal
    // For now, we'll just log a message
    console.log('Redirecting to login...');
    window.location.href = '/login';
  };

  if (!session) {
    return (
      <div className="relative">
        <button onClick={handleLogin} className="flex items-center w-full p-2 focus:outline-none">
          <FiLogIn className="text-xl" style={{ color: theme.accent }}/>
          {!isCollapsed && 
            <span className="ml-4 text-sm font-medium" style={{ color: theme.accent }}>Login</span>
          }
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center w-full p-2 focus:outline-none">
        <FiUser className="text-xl" style={{ color: theme.accent }}/>
        {!isCollapsed && 
          <div className="flex flex-col items-start ml-4">
            <span className="text-sm font-medium" style={{ color: theme.accent }}>{session.user.email}</span>
            {/* Add user tier if you have it in your user data */}
            {/* <span className="text-xs" style={{ color: theme.accent }}>Free</span> */}
          </div>
        }
      </button>
      {isOpen && (
        <div className="absolute bottom-full mb-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5" style={{ backgroundColor: theme.sidebar }}>
          <div className="px-4 py-2 text-xs text-gray-400">{session.user.email}</div>
          <a href="#" className="block px-4 py-2 text-sm" style={{ color: theme.accent }}>Upgrade Plan</a>
          <a href="#" className="block px-4 py-2 text-sm" style={{ color: theme.accent }}>Customization</a>
          <a href="#" className="block px-4 py-2 text-sm" style={{ color: theme.accent }}>Settings</a>
          <a href="#" className="block px-4 py-2 text-sm" style={{ color: theme.accent }}>Help</a>
          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm" style={{ color: theme.accent }}>Logout</button>
        </div>
      )}
    </div>
  );
}
