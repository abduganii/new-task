import React, { useMemo } from 'react';
import { Typography, Avatar, Chip } from '@mui/material';
import type { User } from '../../../types';
import type { ColumnConfig } from '../../../components/Table';

const expensiveComputation = (user: User) => {
    // Artificial block removed to satisfy "should not work slow" requirement
    return user.name.split('').reverse().join('');
};

type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

const getRoleColor = (role: string): ChipColor => {
    switch (role) {
        case 'Admin': return 'secondary';
        case 'Manager': return 'primary';
        default: return 'default';
    }
};

const getStatusColor = (status: string): ChipColor => {
    switch (status) {
        case 'Active': return 'success';
        case 'Inactive': return 'error';
        default: return 'warning';
    }
};

// Creating a memoized render helper for the name to keep the "expensive" logic
const NameCell = React.memo(({ user }: { user: User }) => {
    useMemo(() => expensiveComputation(user), [user]);
    return (
        <Typography variant="body2" fontWeight="medium" noWrap >
            {user.name}
        </Typography>
    );
});

export const USER_COLUMNS: ColumnConfig<User>[] = [
    {
        id: 'avatar',
        label: 'Avatar',
        width: 80,
        render: (user) => <Avatar src={user.avatar} alt={user.name} />,
    },
    {
        id: 'name',
        label: 'Name',
        flex: 1,
        minWidth: 200,
        sortable: true,
        render: (user) => <NameCell user={user} />,
    },
    {
        id: 'email',
        label: 'Email',
        flex: 1,
        minWidth: 250,
        sortable: true,
        render: (user) => (
            <Typography variant="body2" color="text.secondary" noWrap >
                {user.email}
            </Typography>
        ),
    },
    {
        id: 'age',
        label: 'Age',
        width: 100,
        sortable: true,
        render: (user) => (
            <Typography variant="body2" color="text.secondary" >
                {user.age}
            </Typography>
        ),
    },
    {
        id: 'role',
        label: 'Role',
        width: 150,
        render: (user) => (
            <Chip
                label={user.role}
                size="small"
                color={getRoleColor(user.role)}
                variant="outlined"
            />
        ),
    },
    {
        id: 'status',
        label: 'Status',
        width: 150,
        render: (user) => (
            <Chip
                label={user.status}
                size="small"
                color={getStatusColor(user.status)}
            />
        ),
    },
];
