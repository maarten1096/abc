
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from './ThemeProvider';
import { Session } from '@supabase/supabase-js';

interface Recent {
    id: string;
    title: string;
    tool_used: string;
    created_at: string;
}

export default function Search() {
    const { theme } = useTheme();
    const [session, setSession] = useState<Session | null>(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Recent[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);

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

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() === '') {
            setResults([]);
            setSuggestions([]);
            return;
        }

        if (session?.user) {
            const { data, error } = await supabase
                .from('recents')
                .select('*')
                .eq('user_id', session.user.id)
                .ilike('title', `%${query}%`)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error searching recents:', error);
            } else {
                setResults(data as Recent[]);
                if (data.length < 3) {
                    fetchSuggestions();
                }
            }
        } else {
            const localRecents = JSON.parse(localStorage.getItem('recents') || '[]') as Recent[];
            const filteredRecents = localRecents.filter(recent => recent.title.toLowerCase().includes(query.toLowerCase()));
            setResults(filteredRecents);
            if (filteredRecents.length < 3) {
                // For guests, we can't provide AI suggestions as there is no history
                setSuggestions(['Login to get AI-powered suggestions!']);
            }
        }
    };

    const fetchSuggestions = async () => {
        // In a real application, you would make an API call to your AI service
        // For this example, we'll just use a static list of suggestions
        setSuggestions([
            'Suggestion: "industrialisation effects" (summary)',
            'Suggestion: "quiz about biology" (quiz)',
        ]);
    };

    return (
        <div className='p-4' style={{ backgroundColor: theme.main, color: theme.accent }}>
            <form onSubmit={handleSearch}>
                <input
                    type='text'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Search your recents...'
                    className='w-full p-2 rounded-md'
                    style={{ backgroundColor: theme.sidebar, color: theme.accent }}
                />
            </form>
            <div className='mt-4'>
                {results.map(result => (
                    <div key={result.id} className='p-2 rounded-md mb-2' style={{ backgroundColor: theme.sidebar }}>
                        <p className='font-bold'>{result.title}</p>
                        <p className='text-sm' style={{ color: theme.accent }}>{result.tool_used} • {new Date(result.created_at).toLocaleDateString()}</p>
                    </div>
                ))}
                {suggestions.map((suggestion, index) => (
                    <div key={index} className='p-2 rounded-md mb-2' style={{ backgroundColor: theme.sidebar }}>
                        <p>{suggestion}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
