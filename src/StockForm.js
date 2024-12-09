import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function StockForm({ getStockData }) {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol) {
      getStockData(symbol); // Call the function passed as a prop
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2, // Add space between the input and button
        marginBottom: 4, // Add spacing below the form
      }}
    >
      <TextField
        label="Stock Symbol"
        variant="outlined"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        sx={{ 
          width: '300px',
          borderRadius: '20px', // Make it more rounded
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px', // Make the border rounded
          },
          '& .MuiInputLabel-root': {
            fontSize: '14px', // Optional: smaller label font size
          },
        }} // Set the width of the text field
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{
          width: '100px', // Set the width of the button
        }}
      >
        Search
      </Button>
    </Box>
  );
}

export default StockForm;