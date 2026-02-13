import React, { useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Snackbar, Alert, Box } from '@mui/material';
import { Header } from './components/Header';
import { useAppStore } from './store/useAppStore';
import { UserPage } from './page/user';

function App() {
  const { theme, initializeUsers, error, setError } = useAppStore();

  // Initialize data
  useEffect(() => {
    initializeUsers();
  }, [initializeUsers]);

  // Create MUI theme based on store state
  const muiTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,
          primary: {
            main: '#2563eb', // Blue-600 logic from Tailwind
          },
          background: {
            default: theme === 'dark' ? '#09090b' : '#f8fafc', // Zinc-950 / Zinc-50
            paper: theme === 'dark' ? '#18181b' : '#ffffff',   // Zinc-900 / White
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        shape: {
          borderRadius: 8,
        },
      }),
    [theme]
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />

        <UserPage />

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }} variant="filled">
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;