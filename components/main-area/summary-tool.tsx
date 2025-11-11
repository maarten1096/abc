
'use client';

import { SummaryDisplay } from './summary-display';

interface SummaryToolProps {
    summary: string;
    animation: boolean;
}

export function SummaryTool({ summary, animation }: SummaryToolProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Summary Tool</h2>
            <SummaryDisplay summary={summary} animation={animation} />
        </div>
    );
}
