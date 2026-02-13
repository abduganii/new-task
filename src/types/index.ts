export interface User {
    id: string;
    name: string;
    email: string;
    age: number;
    role: 'Admin' | 'User' | 'Manager';
    status: 'Active' | 'Inactive' | 'Pending';
    lastLogin: Date;
    bio: string; // Long text for expensive rendering simulation
    avatar: string;
}

export type SortField = 'name' | 'email' | 'age';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
    role?: string;
    status?: string;
}
