// frontend/src/context/ThemeContext.js
import React, { createContext, useState, useMemo } from 'react';
import getTheme from '../theme';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

// Create a context with default values (fallback values)
export const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
});

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Rebuild the theme whenever the mode changes
  const theme = useMemo(() => getTheme({ mode }), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
