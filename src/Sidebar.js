import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsightsIcon from '@mui/icons-material/Insights';
import ChatIcon from '@mui/icons-material/Chat';
import { Link } from 'react-router-dom';

const Sidebar = ({ selectedTicker }) => {
  return (
    <Box
      sx={{
        width: '240px',
        height: '100vh',
        position: 'fixed',
        top: '64px', // Account for the navbar height
        left: 0,
        backgroundColor: 'primary.main',
        zIndex: 1200,
        paddingTop: 2,
        overflowY: 'auto',
        boxShadow: 2,
      }}
    >
      <List>
        <ListItem button component="a" href="/" sx={{ color: 'white' }}>
          <ListItemIcon sx={{ color: 'white' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Stock Chart" sx={{ color: 'white' }} />
        </ListItem>
        <ListItem button component={Link} to={selectedTicker ? `/stockFinancials/${selectedTicker}` : '/stockFinancials'} sx={{ color: 'white' }} disabled={!selectedTicker} >
          <ListItemIcon sx={{ color: 'white' }}>
            <InsightsIcon />
          </ListItemIcon>
          <ListItemText primary="Financials" sx={{ color: 'white' }} />
        </ListItem>
        <ListItem button component="a" href="/chatbot" sx={{ color: 'white' }} >
          <ListItemIcon sx={{ color: 'white' }}>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="AI Chatbot" sx={{ color: 'white' }} />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
