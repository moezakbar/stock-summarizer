import './App.css';
import React, { useState } from 'react';
import StockForm from './StockForm';
import NavigationBar from './navbar';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AIChatbot from './AIChatbot';
import StockChart from './StockChart';


function App() {
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('weekly');

  const getStockData = async (symbol) => {
    try {
      const weeklyResponse = await axios.get(`/api/stock/weekly/${symbol}`);
      const monthlyResponse = await axios.get(`/api/stock/monthly/${symbol}`);
      
      const weeklyData = weeklyResponse.data;
      const monthlyData = monthlyResponse.data;

      setStockData({
        weekly: weeklyData,
        monthly: monthlyData,
      });
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Could not fetch stock data. Please try again.');
    }
  };

  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Stock Price Summarizer</h1>
              <StockForm getStockData={getStockData} />
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {stockData && (
              <div>
                <StockChart stockData={stockData} chartType={chartType} />
                <div style={{ marginTop: '20px' }}>
                  <button onClick={() => setChartType('weekly')}>Weekly</button>
                  <button onClick={() => setChartType('monthly')}>Monthly</button>
                </div>
              </div>
            )}
            </div>
          }
        />
        <Route path="/chatbot" element={<AIChatbot />} />
      </Routes>
    </Router>
  );
}

export default App;