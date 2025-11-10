
'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase/client';
import { useTheme } from '../../components/ThemeProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.main }}>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg" style={{ backgroundColor: theme.sidebar }}>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme={theme.preset === 'dark' ? 'dark' : 'default'}
          providers={['google', 'github']}
          magicLink
        />
      </div>
    </div>
  );
};

export default function LoginPage() {
    return (
        <Login />
    )
}
