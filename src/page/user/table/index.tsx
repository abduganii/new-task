import React, { useMemo } from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import { useAppStore } from '../../../store/useAppStore';
import { Table } from '../../../components/Table';
import { USER_COLUMNS } from './columns';
import type { User } from '../../../types';

export const UserTable: React.FC = () => {
    const {
        users,
        sortField,
        sortOrder,
        setSort,
        setSelectedUser,
        setIsModalOpen,
        isLoading,
        loadMore
    } = useAppStore();

    // Use nuqs to read filters from URL
    const [searchQuery] = useQueryState('q', parseAsString.withDefault(''));
    const [role] = useQueryState('role', parseAsString.withDefault(''));
    const [status] = useQueryState('status', parseAsString.withDefault(''));

    const processedUsers = useMemo(() => {
        let result = users;

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(
                (user) =>
                    user.name.toLowerCase().includes(lowerQuery) ||
                    user.email.toLowerCase().includes(lowerQuery)
            );
        }

        if (role) {
            result = result.filter((user) => user.role === role);
        }
        if (status) {
            result = result.filter((user) => user.status === status);
        }

        if (sortField) {
            result = [...result].sort((a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];
                if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [users, searchQuery, role, status, sortField, sortOrder]);

    const handleRowClick = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    return (
        <Table
            data={processedUsers}
            columns={USER_COLUMNS}
            isLoading={isLoading}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={setSort}
            onRowClick={handleRowClick}
            onEndReached={loadMore}
            emptyMessage="No users found matching your criteria."
        />
    );
};
