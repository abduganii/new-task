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

    // Pagination State
    page: number;
    pageSize: number;

    setError: (msg: string | null) => void;
    initializeUsers: () => void;
    updateUser: (user: User) => Promise<void>;
    setSort: (field: SortField) => void;
    setSelectedUser: (user: User | null) => void;
    setIsModalOpen: (isOpen: boolean) => void;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
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
    page: 0,
    pageSize: 10,

    setError: (error) => set({ error }),

    initializeUsers: () => {
        set({ isLoading: true });
        setTimeout(() => {
            // Generate full dataset for client-side pagination demonstration
            set({ users: generateUsers(10000), isLoading: false });
        }, 800);
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
    setPage: (page) => set({ page }),
    setPageSize: (pageSize) => set({ pageSize, page: 0 }), // Reset to page 0 when page size changes
});
