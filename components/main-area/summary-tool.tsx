
'use client';

import { useState } from 'react';
import { useRecentsStore } from '@/lib/store';

export function SummaryTool() {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const { addRecent } = useRecentsStore();

    const handleGenerateSummary = async () => {
        try {
            const response = await fetch('/api/embeddings/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (response.ok) {
                const data = await response.json();
                setSummary(data.summary);
                // Add to recents
                const newItem = {
                    id: data.id, // Assuming the API returns an id
                    title: `Summary of ${text.substring(0, 20)}...`,
                    description: data.summary,
                    type: 'summary',
                    created_at: new Date().toISOString(),
                };
                addRecent(newItem);
                // Optionally, save to DB via API
                await fetch('/api/items/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newItem),
                });
            } else {
                console.error('Failed to generate summary');
            }
        } catch (error) {
            console.error('Failed to generate summary:', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Summary Tool</h2>
            <textarea
                className="w-full h-64 p-2 border border-gray-300 rounded-md"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here..."
            />
            <button
                onClick={handleGenerateSummary}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Generate Summary
            </button>
            {summary && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-2">Summary</h3>
                    <div className="p-4 bg-gray-100 rounded-md">
                        {summary}
                    </div>
                </div>
            )}
        </div>
    );
}
