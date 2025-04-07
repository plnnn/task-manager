import React, { createContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

export const ThemeContext = createContext();

export const AppThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode, // 'light' or 'dark'
      primary: {
        main: mode === 'light' ? '#1976d2' : '#90caf9',
      },
      secondary: {
        main: mode === 'light' ? '#f50057' : '#ff80ab',
      },
      error: {
        main: mode === 'light' ? '#d32f2f' : '#ef5350',
      },
      success: {
        main: mode === 'light' ? '#2e7d32' : '#4caf50',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#212121',
        paper: mode === 'light' ? '#ffffff' : '#424242',
      },
      text: {
        primary: mode === 'light' ? '#212121' : '#ffffff',
        secondary: mode === 'light' ? '#757575' : '#bdbdbd',
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: mode === 'light' ? '#e0e0e0' : '#616161',
              },
              '&:hover fieldset': {
                borderColor: mode === 'light' ? '#bdbdbd' : '#9e9e9e',
              },
              '&.Mui-focused fieldset': {
                borderColor: mode === 'light' ? '#1976d2' : '#90caf9',
              },
            },
            '& .MuiInputLabel-root': {
              color: mode === 'light' ? '#757575' : '#bdbdbd',
            },
            '& .MuiInputBase-input': {
              color: mode === 'light' ? '#212121' : '#ffffff',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            '&:hover': {
              opacity: 0.9,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: mode === 'light' ? '#757575' : '#bdbdbd',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: ({ ownerState, theme }) => ({
            borderRadius: theme.shape.borderRadius,
            ...(ownerState.severity === 'error' && {
              backgroundColor: mode === 'light' ? '#ffebee' : '#d32f2f',
              color: mode === 'light' ? '#d32f2f' : '#ffffff',
            }),
          }),
          icon: {
            color: 'inherit !important',
          },
        },
      },
    },
  }), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};