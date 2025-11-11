
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserItem {
  id: string;
  title: string;
  description: string;
  type: string;
  created_at: string;
}

interface UIState {
  sidebarCollapsed: boolean;
  activeTool: string;
  theme: {
    preset: string;
    main: string;
    accent: string;
    sidebar: string;
  };
  summary: string;
  inputText: string;
  animation: boolean;
  toggleSidebar: () => void;
  setActiveTool: (tool: string) => void;
  setSummary: (summary: string) => void;
  setInputText: (text: string) => void;
  setAnimation: (animation: boolean) => void;
}

interface UserState {
  session: {
    id: string | null;
    email: string | null;
    username: string | null;
    tier: string;
  } | null;
  setSession: (session: UserState['session']) => void;
}

interface RecentsState {
  recents: UserItem[];
  setRecents: (items: UserItem[]) => void;
  addRecent: (item: UserItem) => void;
}


export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            sidebarCollapsed: false,
            activeTool: 'summary',
            theme: {
                preset: 'default',
                main: '#FFFFFF',
                accent: '#000000',
                sidebar: '#F9FAFB',
            },
            summary: '',
            inputText: '',
            animation: true,
            toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
            setActiveTool: (tool) => set({ activeTool: tool }),
            setSummary: (summary) => set({ summary }),
            setInputText: (text) => set({ inputText: text }),
            setAnimation: (animation) => set({ animation }),
        }),
        { name: 'ui-storage' }
    )
);

export const useUserStore = create<UserState>()( persist( (set) => ({ session: null, setSession: (session) => set({ session }), }), { name: 'user-storage' } ) );

export const useRecentsStore = create<RecentsState>()(
    persist(
        (set) => ({
            recents: [],
            setRecents: (items) => set({ recents: items }),
            addRecent: (item) => set((state) => ({ recents: [item, ...state.recents] })),
        }),
        { name: 'recents-storage' }
    )
);
