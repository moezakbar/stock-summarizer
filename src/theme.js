import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Set the theme mode to dark
    primary: {
      main: '#90caf9', // Customize primary color
    },
    secondary: {
      main: '#f48fb1', // Customize secondary color
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1d1d1d', // Cards and paper components
    },
    text: {
      primary: '#ffffff', // Main text color
      secondary: '#b0bec5', // Secondary text color
    },
  },
});

export default darkTheme;
