
'use client';

import { useUIStore } from '@/lib/store';
import { SummaryTool } from './summary-tool';
// Import other tools as they are created

export function MainArea() {
    const { activeTool } = useUIStore();

    const renderTool = () => {
        switch (activeTool) {
            case 'summary':
                return <SummaryTool />;
            // Add cases for other tools
            default:
                return <div>Select a tool</div>;
        }
    };

    return (
        <div className="flex-1 p-8">
            {renderTool()}
        </div>
    );
}
