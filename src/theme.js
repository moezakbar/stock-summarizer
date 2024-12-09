import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'light', // Change from 'dark' to 'light'
    primary: {
      main: '#1976d2', // Blue (default primary color in MUI)
    },
    secondary: {
      main: '#dc004e', // Pink (default secondary color in MUI)
    },
    background: {
      default: '#f5f5f5', // Light grey background
      paper: '#ffffff',   // White paper background
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#5f6368', // Light grey text
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Default typography
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f5f5f5', // Apply light background globally
          color: '#000000',           // Default text color
        },
      },
    },
  },
});

export default darkTheme;
