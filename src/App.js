
import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, Button, Box, Typography } from '@mui/material';
import StockForm from './StockForm';
import NavigationBar from './navbar';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AIChatbot from './AIChatbot';
import StockChart from './StockChart';
import darkTheme from './theme';


function App() {
  const [stockData, setStockData] = useState(null);
  const [companyName, setCompanyName] = useState('Stock Price Summarizer');
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('weekly');

  const getStockData = async (symbol) => {
    try {
      const weeklyResponse = await axios.get(`/api/stock/weekly/${symbol}`);
      const monthlyResponse = await axios.get(`/api/stock/monthly/${symbol}`);
      const companyResponse = await axios.get(`/api/stock/company/${symbol}`);
      
      const weeklyData = weeklyResponse.data;
      const monthlyData = monthlyResponse.data;
      const companyData = companyResponse.data;

      if (companyData.error) {
        throw new Error(companyData.error);
      }
  
      setCompanyName(companyData.name);
      setStockData({
        weekly: weeklyData,
        monthly: monthlyData,
      });
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError(`Error fetching stock data: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <NavigationBar />
        <Routes>
          <Route
            path="/"
            element={
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  padding: 2,
                  border: '5px solid', 
                  borderColor: 'primary.main', 
                  borderRadius: 2, 
                  margin: '20px auto', 
                  boxShadow: 3, 
                  maxWidth: '80%', 
                  height: 'auto',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start', // Align items vertically centered
                    justifyContent: 'space-between', // Add space between elements
                    width: '100%',
                    maxWidth: '1200px',
                    gap: 2, // Adjust gap between the elements if necessary
                  }}
                >
                  <Typography variant="h4" sx={{ flexShrink: 0 }}>
                    {companyName} {/* Display the company name */}
                  </Typography>

                  {/* Form Section */}
                  <Box sx={{ flex: 1, maxWidth: '300px' }}>
                    <StockForm getStockData={getStockData} />
                  </Box>
                </Box>
                
                {/* Chart Section */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'flex-start',
                    width: '100%',
                    maxWidth: '1200px',
                  }}
                >
                
                {error && (
                    <Typography variant="body1" color="error" sx={{ flex: 1 }}>
                      {error}
                    </Typography>
                  )}
                  {stockData && (
                    <Box sx={{ flex: 1 }}>
                      <StockChart stockData={stockData} chartType={chartType} />
                      <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setChartType('weekly')}
                        >
                          Weekly
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setChartType('monthly')}
                        >
                          Monthly
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            }
          />
          <Route path="/chatbot" element={<AIChatbot />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;