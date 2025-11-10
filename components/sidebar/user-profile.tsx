
'use client';

import { useUserStore, useUIStore } from '@/lib/store';

export function UserProfile() {
    const { session } = useUserStore();
    const { sidebarCollapsed } = useUIStore();

    if (!session) return null;

    return (
        <div className="flex items-center p-4 border-t border-gray-200">
            <img src="/avatar.png" alt="User Avatar" className="w-8 h-8 rounded-full" />
            {!sidebarCollapsed && (
                <div className="ml-4">
                    <div className="font-semibold">{session.username}</div>
                    <div className="text-sm text-gray-500">{session.tier}</div>
                </div>
            )}
        </div>
    );
}
