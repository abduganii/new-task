import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    CircularProgress,
    Chip,
    Box,
    useTheme as useMuiTheme,
} from '@mui/material';
import { Brightness4, Brightness7, Refresh } from '@mui/icons-material';
import { useAppStore } from '../store/useAppStore';

export const Header: React.FC = () => {
    const { theme, setTheme, isLoading, users } = useAppStore();
    const muiTheme = useMuiTheme();

    return (
        <AppBar
            position="sticky"
            color="default"
            elevation={1}
            sx={{
                backgroundColor: theme === 'dark' ? 'rgba(24, 24, 27, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                borderBottom: `1px solid ${muiTheme.palette.divider}`
            }}
        >
            <Toolbar>
                <Box display="flex" alignItems="center" flexGrow={1} gap={2}>
                    <Box
                        bgcolor="primary.main"
                        color="primary.contrastText"
                        p={0.5}
                        borderRadius={1}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {isLoading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <Refresh fontSize="small" />
                        )}
                    </Box>
                    <Typography variant="h6" component="div" fontWeight="bold">
                        High-Volume Users Dashboard
                    </Typography>
                    <Chip
                        label={isLoading ? 'Wait...' : `${users.length.toLocaleString()} Users`}
                        size="small"
                        variant="outlined"
                        sx={{ fontFamily: 'monospace' }}
                    />
                </Box>

                <IconButton
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    color="inherit"
                >
                    {theme === 'light' ? <Brightness4 /> : <Brightness7 />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};
