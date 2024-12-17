import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
  palette: {
    primary: {
      main: '#333333', // Dark grey for accents
    },
    secondary: {
      main: '#f5f5f5', // Light grey for highlights
    },
    background: {
      default: '#f5f5f5', // Light grey for the entire app
      paper: '#f5f5f5', // Light grey for cards, drawers, etc.
    },
    text: {
      primary: '#333333', // Dark text
      secondary: '#666666', // Subtle text
    },
  },
});

export default Theme;
