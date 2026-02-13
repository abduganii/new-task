import { type StateCreator } from 'zustand';
import type { User, SortField, SortOrder } from '../../types';
import { generateUsers } from '../../utils/generateUsers';

export interface UserSlice {
    users: User[];
    isLoading: boolean;
    error: string | null;
    isSaving: boolean;
    sortField: SortField | null;
    sortOrder: SortOrder;
    selectedUser: User | null;
    isModalOpen: boolean;

    setError: (msg: string | null) => void;
    initializeUsers: () => void;
    loadMore: () => void;
    updateUser: (user: User) => Promise<void>;
    setSort: (field: SortField) => void;
    setSelectedUser: (user: User | null) => void;
    setIsModalOpen: (isOpen: boolean) => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
    users: [],
    isLoading: true,
    error: null,
    isSaving: false,
    sortField: null,
    sortOrder: 'asc',
    selectedUser: null,
    isModalOpen: false,

    setError: (error) => set({ error }),

    initializeUsers: () => {
        set({ isLoading: true });
        setTimeout(() => {
            set({ users: generateUsers(10), isLoading: false });
        }, 500);
    },

    loadMore: () => {
        const { users, isLoading } = get();
        if (isLoading || users.length >= 10000) return;

        set({ isLoading: true });
        setTimeout(() => {
            set((state) => ({
                users: [...state.users, ...generateUsers(10)],
                isLoading: false
            }));
        }, 300);
    },

    updateUser: async (updatedUser) => {
        const { users } = get();
        const previousUsers = [...users];

        set({ isSaving: true, error: null });

        set({
            users: users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
            isModalOpen: false,
            selectedUser: null,
        });

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            set({ isSaving: false });
        } catch (err) {
            console.error(err);
            set({
                users: previousUsers,
                error: 'Failed to update user. Reverting...',
                isSaving: false,
            });
            setTimeout(() => set({ error: null }), 3000);
        }
    },

    setSort: (field) =>
        set((state) => {
            if (state.sortField === field) {
                return { sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' };
            }
            return { sortField: field, sortOrder: 'asc' };
        }),

    setSelectedUser: (user) => set({ selectedUser: user }),
    setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
});
