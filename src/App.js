
import React, { useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider, Button, Box, Typography } from '@mui/material';
import StockForm from './StockForm';
import NavigationBar from './navbar';
import Sidebar from './Sidebar';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AIChatbot from './AIChatbot';
import StockChart from './StockChart';
import StockFinancials from './stockFinancials';
import Theme from './theme';


function App() {
  const [stockData, setStockData] = useState(null);
  const [companyName, setCompanyName] = useState('Stock Price Summarizer');
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('weekly');
  const [currentPrice, setCurrentPrice] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(null);
  const [currentPercentageChange, setCurrentPercentageChange] = useState(null);
  const [selectedTicker, setSelectedTicker] = useState(null);


  // Update hovered price
  const handleHoveredPrice = (price) => {
    setCurrentPrice(price);
    if (originalPrice) {
      const percentage = (((price - originalPrice) / originalPrice) * 100).toFixed(2);
      setCurrentPercentageChange(percentage);
    }
  };

  // Reset price to original
  const resetPrice = () => {
    setCurrentPrice(originalPrice);
    
    // calculate total percentage change overall and reset it to that variable
    if (originalPrice && stockData) {
      const dataPoints = stockData[chartType];
      if (dataPoints && dataPoints.length > 0) {
        const earliestPrice = dataPoints[0].adjustedClose;
        const totalPercentageChange = (((originalPrice - earliestPrice) / earliestPrice) * 100).toFixed(2);
        setCurrentPercentageChange(totalPercentageChange);
      }
    }
  };

  // Set original price when stock data changes
  useEffect(() => {
    if (stockData) {
      const dataPoints = stockData[chartType];
      if (dataPoints && dataPoints.length > 0) {
        const latestPrice = dataPoints[dataPoints.length - 1].adjustedClose;
        const earliestPrice = dataPoints[0].adjustedClose;
  
        const totalPercentageChange = (((latestPrice - earliestPrice) / earliestPrice) * 100).toFixed(2);
  
        setOriginalPrice(latestPrice);
        setCurrentPrice(latestPrice);
        setCurrentPercentageChange(totalPercentageChange); // Initialize percentage change here
      }
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
      setSelectedTicker(symbol);
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
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <Router>
        <NavigationBar />

        <Box sx={{ display: 'flex', marginTop: '64px', }}>
          
          <Sidebar selectedTicker={selectedTicker}/>

          <Box 
            component="main"
            sx={{ 
              flexGrow: 1,
              marginLeft: '180px', // Sidebar width
              padding: 2,
              backgroundColor: '#f5f5f5', // Optional background color for content
              minHeight: '100vh', 
              }}
          >
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
                      margin: '20px auto',  
                      maxWidth: '100%', 
                      height: 'auto',
                      marginTop: 0,
                      marginLeft: 10,
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
                        flex: 1,
                        minWidth: '250px'
                        }}>
                        
                        <Typography variant="h4" sx={{ flexShrink: 0, }}>
                          {companyName} {/* Display the company name */}
                        </Typography>

                        <Typography variant="h6" sx={{ color: 'primary.main', mt: 1, fontSize: 50, }}>
                          {currentPrice ? (
                            <>
                              ${currentPrice.toFixed(2)} USD
                              <Typography
                                variant="body1"
                                sx={{
                                  color: currentPercentageChange >= 0 ? 'green' : 'red', // Green for positive, red for negative
                                  fontSize: 20,
                                  marginLeft: 1,
                                }}
                                component="span"
                              >
                                ({currentPercentageChange >= 0 ? '+' : ''}{currentPercentageChange}%)
                              </Typography>
                            </>
                          ) : (
                            ''
                          )}
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
                        <Box sx={{ width: '100%', maxWidth: '1000px', aspectRatio: '16 / 9' }}>
                          <StockChart
                            stockData={stockData}
                            chartType={chartType}
                            setHoveredPrice={handleHoveredPrice}
                            resetPrice={resetPrice}
                            setPercentageChange={setCurrentPercentageChange}
                          />
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
              <Route path="/stockFinancials/:ticker" element={<StockFinancials />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;