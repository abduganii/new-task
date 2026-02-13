import React from 'react';
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Avatar,
    TablePagination
} from '@mui/material';
import {
    ArrowUpward,
    ArrowDownward,
    OpenInNew
} from '@mui/icons-material';
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
    emptyMessage?: string;

    // Pagination props
    totalCount: number;
    page: number;
    pageSize: number;
    onPageChange: (newPage: number) => void;
    onPageSizeChange: (newPageSize: number) => void;
}

export function Table<T extends { id: string | number }>({
    data,
    columns,
    isLoading = false,
    sortField,
    sortOrder,
    onSort,
    onRowClick,
    emptyMessage = "No data found.",
    totalCount,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange
}: TableProps<T>) {

    if (isLoading && data.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="400px">
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
                overflow: 'hidden',
                bgcolor: 'background.paper'
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
                            userSelect: 'none',
                            '&:hover': {
                                color: column.sortable ? 'primary.main' : 'inherit'
                            }
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

            {/* List Body */}
            <Box sx={{ flex: 1, overflow: 'auto', position: 'relative', minHeight: '400px' }}>
                {data.length > 0 ? (
                    data.map((item) => (
                        <Box
                            key={item.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                borderBottom: 1,
                                borderColor: 'divider',
                                cursor: onRowClick ? 'pointer' : 'default',
                                bgcolor: 'background.paper',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                    '& .row-actions': { opacity: 1 }
                                },
                                transition: 'all 0.2s ease',
                                position: 'relative'
                            }}
                            onClick={() => onRowClick && onRowClick(item)}
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
                    ))
                ) : (
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'text.secondary',
                            gap: 2,
                            py: 8
                        }}
                    >
                        <Avatar sx={{ bgcolor: 'action.selected', width: 64, height: 64 }}>
                            <OpenInNew sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Typography variant="h6">{emptyMessage}</Typography>
                    </Box>
                )}

                {isLoading && data.length > 0 && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(255,255,255,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2,
                            backdropFilter: 'blur(2px)'
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}
            </Box>

            {/* Footer with Pagination */}
            <Box
                bgcolor="background.default"
                borderTop={1}
                borderColor="divider"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={2}
            >
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    Total: {totalCount.toLocaleString()} items
                </Typography>

                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={(_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => onPageChange(newPage)}
                    rowsPerPage={pageSize}
                    onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onPageSizeChange(parseInt(event.target.value, 10))}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    sx={{
                        border: 'none',
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            color: 'text.secondary'
                        }
                    }}
                />
            </Box>
        </Paper>
    );
}
