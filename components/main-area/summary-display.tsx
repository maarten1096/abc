
'use client';

import { useEffect, useState } from 'react';

interface SummaryDisplayProps {
    summary: string;
    animation: boolean;
}

export function SummaryDisplay({ summary, animation }: SummaryDisplayProps) {
    const [displayedSummary, setDisplayedSummary] = useState('');

    useEffect(() => {
        if (animation) {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedSummary(summary.slice(0, i));
                i++;
                if (i > summary.length) {
                    clearInterval(interval);
                }
            }, 10);
            return () => clearInterval(interval);
        } else {
            setDisplayedSummary(summary);
        }
    }, [summary, animation]);

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">Summary</h3>
            <div className="p-4 bg-gray-100 rounded-md">
                {displayedSummary}
            </div>
        </div>
    );
}
