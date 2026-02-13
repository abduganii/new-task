import React from 'react';
import {
    TextField,
    MenuItem,
    Stack,
    InputAdornment,
    Paper,
    Box,
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useQueryState, parseAsString } from 'nuqs';

const ROLE_OPTIONS = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Manager', label: 'Manager' },
    { value: 'User', label: 'User' },
];

const STATUS_OPTIONS = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Pending', label: 'Pending' },
];

export const UserControls: React.FC = () => {
    const [searchQuery, setSearchQuery] = useQueryState('q', parseAsString.withDefault('').withOptions({ shallow: false, history: 'replace' }));
    const [role, setRole] = useQueryState('role', parseAsString.withDefault('').withOptions({ shallow: false }));
    const [status, setStatus] = useQueryState('status', parseAsString.withDefault('').withOptions({ shallow: false }));

    return (
        <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name or email..."
                    value={searchQuery || ''}
                    onChange={(e) => setSearchQuery(e.target.value || null)}
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                <Stack direction="row" spacing={2} minWidth={{ sm: '400px' }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <FilterIcon color="action" />
                    </Box>

                    <TextField
                        select
                        fullWidth
                        label="Role"
                        value={role || ''}
                        onChange={(e) => setRole(e.target.value || null)}
                        size="small"
                    >
                        <MenuItem value="">All Roles</MenuItem>
                        {ROLE_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        label="Status"
                        value={status || ''}
                        onChange={(e) => setStatus(e.target.value || null)}
                        size="small"
                    >
                        <MenuItem value="">All Statuses</MenuItem>
                        {STATUS_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>
            </Stack>
        </Paper>
    );
};
