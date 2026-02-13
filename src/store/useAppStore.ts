import { create } from 'zustand';
import { createUserSlice, type UserSlice } from './slices/userSlice';
import { createThemeSlice, type ThemeSlice } from './slices/themeSlice';

export type AppState = UserSlice & ThemeSlice;

export const useAppStore = create<AppState>()((...a) => ({
    ...createUserSlice(...a),
    ...createThemeSlice(...a),
}));
