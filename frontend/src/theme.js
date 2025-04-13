// frontend/src/theme.js
import { createTheme } from '@mui/material/styles';

const getTheme = ({ mode = 'light', direction = 'ltr' } = {}) => {
  return createTheme({
    palette: {
      mode, // This automatically applies MUI's built‑in light/dark colors
      primary: {
        main: mode === 'light' ? '#f93a9a' : '#d81476',
      },
      secondary: {
        main: mode === 'light' ? '#000000' : '#ff49c1',
      },
      background: {
        default: mode === 'light' ? '#f4f4f4' : '#303030',
      },
    },
    direction, // "ltr" or "rtl"
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });
};

export default getTheme;
