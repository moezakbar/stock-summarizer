import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'; // Ensure Box is imported
import { useTheme } from '@mui/material/styles';


const NavigationBar = () => {

  const theme = useTheme();
  
  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1300, // Ensure it stays above the sidebar
        backgroundColor: theme.palette.background.paper, // Light grey
        color: theme.palette.text.primary,
      }}
    >
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Stock Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" href="/">
              Home
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavigationBar;
