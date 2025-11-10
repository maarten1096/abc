
'use client';

import { Header } from './header';
import { Navigation } from './navigation';
import { RecentItems } from './recent-items';
import { UserProfile } from './user-profile';
import { useUIStore } from '@/lib/store';

export function Sidebar() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className={`flex flex-col h-full bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
      <Header />
      <Navigation />
      <RecentItems />
      <UserProfile />
    </div>
  );
}
