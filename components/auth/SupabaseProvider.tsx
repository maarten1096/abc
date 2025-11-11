
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Session, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseProviderProps {
    children: React.ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        const supabaseClient = createClient();
        setSupabase(supabaseClient);

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_, session) => {
            setSession(session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <>{children}</>
    );
};
