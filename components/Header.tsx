
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export function Header() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        getUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            // Refresh the page on login/logout to ensure server components are re-rendered
            router.refresh();
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase.auth, router]);

    const handleLogin = () => {
        router.push('/login');
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header className="flex items-center justify-end p-4 border-b">
            {user ? (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{user.email}</span>
                    <Button onClick={handleLogout} variant="outline">Logout</Button>
                </div>
            ) : (
                <Button onClick={handleLogin}>Login</Button>
            )}
        </header>
    );
}
