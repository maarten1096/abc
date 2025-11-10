
'use client';

import { useEffect } from 'react';
import { useRecentsStore, useUIStore } from '@/lib/store';

export function RecentItems() {
    const { recents, setRecents } = useRecentsStore();
    const { sidebarCollapsed } = useUIStore();

    useEffect(() => {
        const fetchRecents = async () => {
            try {
                const response = await fetch('/api/items/recent');
                if (response.ok) {
                    const data = await response.json();
                    setRecents(data.items);
                }
            } catch (error) {
                console.error('Failed to fetch recent items:', error);
            }
        };

        fetchRecents();
    }, [setRecents]);

    return (
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {!sidebarCollapsed && <h3 className="text-sm font-semibold text-gray-500">Recent</h3>}
            {recents.map((item) => (
                <div key={item.id} className="p-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-gray-200">
                    {item.title}
                </div>
            ))}
        </div>
    );
}
