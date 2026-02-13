import { type StateCreator } from 'zustand';

export interface ThemeSlice {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

export const createThemeSlice: StateCreator<ThemeSlice> = (set) => ({
    theme: 'light',
    setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
    },
});
