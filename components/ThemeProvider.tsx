
'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

type Theme = {
  preset: string;
  main: string;
  sidebar: string;
  accent: string;
};

type ThemeContextType = {
  theme: Theme;
  setPreset: (name: string) => void;
  updateColor: (key: 'main' | 'sidebar' | 'accent', value: string) => void;
};

const defaultTheme: Theme = {
  preset: 'light',
  main: '#f7f7f7',
  sidebar: '#ededed',
  accent: '#2e2e2e',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const themeApi = useMemo(() => {
    const setPreset = (name: string) => {
      // In a real app, you'd fetch the preset's colors
      // For now, we'll just switch between light and dark
      if (name === 'dark') {
        setTheme({
          preset: 'dark',
          main: '#1a1a1a',
          sidebar: '#202020',
          accent: '#ffffff',
        });
      } else {
        setTheme(defaultTheme);
      }
    };

    const updateColor = (key: 'main' | 'sidebar' | 'accent', value: string) => {
      setTheme(prevTheme => ({
        ...prevTheme,
        preset: 'custom',
        [key]: value,
      }));
    };

    return { setPreset, updateColor };
  }, []);

  const value = {
    theme,
    ...themeApi,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
