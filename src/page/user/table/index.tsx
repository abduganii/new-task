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
        page,
        pageSize,
        setPage,
        setPageSize
    } = useAppStore();

    // Use nuqs to read filters from URL
    const [searchQuery] = useQueryState('q', parseAsString.withDefault(''));
    const [role] = useQueryState('role', parseAsString.withDefault(''));
    const [status] = useQueryState('status', parseAsString.withDefault(''));

    const filteredAndSortedUsers = useMemo(() => {
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

                const isDate = (val: unknown): val is Date => val instanceof Date;

                if (isDate(aValue) && isDate(bValue)) {
                    return sortOrder === 'asc'
                        ? aValue.getTime() - bValue.getTime()
                        : bValue.getTime() - aValue.getTime();
                }

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortOrder === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
                }
                return 0;
            });
        }

        return result;
    }, [users, searchQuery, role, status, sortField, sortOrder]);

    const paginatedUsers = useMemo(() => {
        const start = page * pageSize;
        return filteredAndSortedUsers.slice(start, start + pageSize);
    }, [filteredAndSortedUsers, page, pageSize]);

    const handleRowClick = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    return (
        <Table
            data={paginatedUsers}
            columns={USER_COLUMNS}
            isLoading={isLoading}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={setSort}
            onRowClick={handleRowClick}
            emptyMessage="No users found matching your criteria."
            totalCount={filteredAndSortedUsers.length}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
        />
    );
};
