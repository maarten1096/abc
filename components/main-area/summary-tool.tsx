
'use client';

import { useEffect, useState } from 'react';
import { useGenerationStore } from '@/lib/generationStore';

const Cursor = () => <span className="inline-block w-2 h-5 bg-gray-700 animate-pulse ml-1" />;

export function SummaryTool() {
    const { summary, isLoading } = useGenerationStore();
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        if (isLoading) {
            if (displayedText === '') setDisplayedText(' ');
            return;
        }

        if (!summary) {
            setDisplayedText('');
            return;
        }

        let i = 0;
        setDisplayedText('');
        const interval = setInterval(() => {
            setDisplayedText(summary.slice(0, i));
            i++;
            if (i > summary.length) {
                clearInterval(interval);
            }
        }, 10);

        return () => clearInterval(interval);
    }, [summary, isLoading]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 relative overflow-y-auto bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, transparent 49%, #e0e0e0 49%, #e0e0e0 51%, transparent 51%)`,
                        backgroundSize: '100% 2.2em',
                        top: '0.7em',
                    }}
                />
                <div className="relative z-10 font-serif text-lg leading-[2.2] whitespace-pre-wrap">
                    {isLoading && !summary ? <Cursor /> : displayedText}
                    {isLoading && summary && <Cursor />}
                </div>
            </div>
        </div>
    );
}
