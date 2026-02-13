import React, { useRef, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Avatar
} from '@mui/material';
import { ArrowUpward, ArrowDownward, OpenInNew } from '@mui/icons-material';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { SortField, SortOrder } from '../types';

export interface ColumnConfig<T> {
    id: string;
    label: string;
    width?: number;
    minWidth?: number;
    flex?: number;
    sortable?: boolean;
    render: (item: T) => React.ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: ColumnConfig<T>[];
    isLoading?: boolean;
    sortField?: SortField | null;
    sortOrder?: SortOrder;
    onSort?: (field: SortField) => void;
    onRowClick?: (item: T) => void;
    onEndReached?: () => void;
    emptyMessage?: string;
    rowHeight?: number;
}

export function Table<T extends { id: string | number }>({
    data,
    columns,
    isLoading = false,
    sortField,
    sortOrder,
    onSort,
    onRowClick,
    onEndReached,
    emptyMessage = "No data found.",
    rowHeight = 73
}: TableProps<T>) {
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => rowHeight,
        overscan: 10,
    });

    const virtualItems = virtualizer.getVirtualItems();
    const lastFetchedLengthRef = useRef(data.length);
    const isAtBottomRef = useRef(false);

    // Track scroll position to determine if we should auto-scroll new items
    useEffect(() => {
        const el = parentRef.current;
        if (!el) return;
        const handleScroll = () => {
            const isNearBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 100;
            isAtBottomRef.current = isNearBottom;
        };
        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!onEndReached || virtualItems.length === 0 || isLoading || data.length >= 10000) return;

        // Prevent duplicate trigger for same data length
        if (data.length === lastFetchedLengthRef.current && data.length > 0) return;

        const lastItem = virtualItems[virtualItems.length - 1];
        // Trigger as soon as the last item enters the overscan/view
        if (lastItem.index >= data.length - 1) {
            lastFetchedLengthRef.current = data.length;
            onEndReached();
        }
    }, [virtualItems, data.length, onEndReached, isLoading]);

    // Smooth scroll down to reveal new items if user was already at the bottom
    useEffect(() => {
        if (data.length > lastFetchedLengthRef.current && isAtBottomRef.current) {
            setTimeout(() => {
                parentRef.current?.scrollTo({
                    top: parentRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
            lastFetchedLengthRef.current = data.length;
        }
    }, [data.length]);

    if (isLoading && data.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden'
            }}
        >
            {/* Header */}
            <Box
                display="flex"
                alignItems="center"
                bgcolor={(theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}
                borderBottom={1}
                borderColor="divider"
                fontWeight="bold"
                color="text.secondary"
                sx={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}
            >
                {columns.map((column) => (
                    <Box
                        key={column.id}
                        width={column.width}
                        minWidth={column.minWidth}
                        flex={column.flex}
                        p={2}
                        flexShrink={0}
                        sx={{
                            cursor: column.sortable && onSort ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            userSelect: 'none'
                        }}
                        onClick={() => column.sortable && onSort && onSort(column.id as SortField)}
                    >
                        {column.label}
                        {column.sortable && sortField === column.id && (
                            sortOrder === 'asc'
                                ? <ArrowUpward fontSize="small" sx={{ ml: 1, fontSize: 16 }} />
                                : <ArrowDownward fontSize="small" sx={{ ml: 1, fontSize: 16 }} />
                        )}
                    </Box>
                ))}
            </Box>

            {/* Virtualized Rows */}
            <Box ref={parentRef} sx={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                <Box
                    sx={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {virtualItems.map((virtualRow) => {
                        const item = data[virtualRow.index];
                        if (!item) return null;
                        return (
                            <Box
                                key={item.id}
                                onClick={() => onRowClick && onRowClick(item)}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    cursor: onRowClick ? 'pointer' : 'default',
                                    bgcolor: 'background.paper',
                                    '&:hover': {
                                        bgcolor: onRowClick ? 'action.hover' : 'inherit',
                                    },
                                    transition: 'background-color 0.2s',
                                }}
                            >
                                {columns.map((column) => (
                                    <Box
                                        key={column.id}
                                        width={column.width}
                                        minWidth={column.minWidth}
                                        flex={column.flex}
                                        p={2}
                                        flexShrink={0}
                                        overflow="hidden"
                                    >
                                        {column.render(item)}
                                    </Box>
                                ))}
                            </Box>
                        );
                    })}

                    {data.length === 0 && !isLoading && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'text.secondary',
                                gap: 2
                            }}
                        >
                            <Avatar sx={{ bgcolor: 'action.selected', width: 56, height: 56 }}>
                                <OpenInNew />
                            </Avatar>
                            <Typography>{emptyMessage}</Typography>
                        </Box>
                    )}
                </Box>

                {/* Loader at the bottom */}
                {isLoading && data.length > 0 && (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        p={4}
                        gap={1}
                    >
                        <CircularProgress size={24} />
                        <Typography variant="caption" color="text.secondary">Fetching more users...</Typography>
                    </Box>
                )}

                {/* Invisible trigger padding to help scroll detect the bottom */}
                <Box sx={{ height: 20 }} />
            </Box>

            <Box
                p={1.5}
                px={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="background.default"
                borderTop={1}
                borderColor="divider"
            >
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    Total Dashboard Capacity: {data.length.toLocaleString()} / 10,000
                </Typography>
            </Box>
        </Paper>
    );
}
