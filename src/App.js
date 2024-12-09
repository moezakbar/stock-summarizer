
import React, { useState, useEffect } from 'react';
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
  const [currentPrice, setCurrentPrice] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(null);

  // Update hovered price
  const handleHoveredPrice = (price) => {
    setCurrentPrice(price);
  };

  // Reset price to original
  const resetPrice = () => {
    setCurrentPrice(originalPrice);
  };

  // Set original price when stock data changes
  useEffect(() => {
    if (stockData) {
      const latestPrice = stockData[chartType][stockData[chartType].length - 1].adjustedClose;
      setOriginalPrice(latestPrice);
      setCurrentPrice(latestPrice);
    }
  }, [stockData, chartType]);

  const getStockData = async (symbol) => {
    try {
      setError('')

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
                  maxWidth: '90%', 
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
                    gap: 2, 
                    flexWrap: 'wrap',
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-start', 
                    border: '5px solid', 
                    borderColor: 'secondary.main', 
                    borderRadius: 2, 
                    flex: 1,
                    minWidth: '250px'
                    }}>
                    
                    <Typography variant="h4" sx={{ flexShrink: 0, }}>
                      {companyName} {/* Display the company name */}
                    </Typography>

                    <Typography variant="h6" sx={{ color: 'primary.main', mt: 1, fontSize: 50, }}>
                      ${currentPrice?.toFixed(2)} USD
                    </Typography>

                  </Box>

                  {/* Form Section */}
                  <Box sx={{ flex: 1, maxWidth: '300px', minWidth: '250px', border: '5px solid', borderColor: 'secondary.main', borderRadius: 2, display: 'flex', flexDirection: 'column',}}>
                    <StockForm getStockData={getStockData} />
                  </Box>

                </Box>
                
                {/* Chart Section */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column', // Align content vertically
                    alignItems: 'center',
                    gap: 2,
                    width: '100%',
                    maxWidth: '1200px',
                    border: '5px solid',
                    borderColor: 'secondary.main',
                    borderRadius: 2,
                    padding: 2,
                    boxSizing: 'border-box', // Ensure padding is respected
                  }}
                >
                
                  {error && (
                    <Typography variant="body1" color="error" sx={{ flex: 1 }}>
                      {error}
                    </Typography>
                  )}
                  {stockData && (
                    <Box sx={{ 
                      width: '100%',
                      maxWidth: '1000px', // Restrict max width to fit the parent box
                      aspectRatio: '16 / 9', 
                      }}>
                      <StockChart stockData={stockData} chartType={chartType} setHoveredPrice={handleHoveredPrice} resetPrice={resetPrice}/>
                      <Box sx={{ marginTop: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
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