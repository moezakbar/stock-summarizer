import './App.css';
import React, { useState } from 'react';
import StockForm from './StockForm';
import axios from 'axios';

function App() {
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

  const getStockData = async (symbol) => {
    try {
      // Reset error state before making the API call
      setError(null);

      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`
      );

      // Check if there's an error in the API response (Alpha Vantage returns an "Error Message" field)
      if (response.data['Error Message']) {
        throw new Error('Invalid stock symbol');
      }

      setStockData(response.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      // Set error message to display in the UI
      setError('Could not fetch stock data. Please check the stock symbol or try again later.');
    }
  };
  
  
  return (
    <div>
      <h1>Stock Price Summarizer</h1>
      <StockForm getStockData={getStockData} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {stockData && (
        <pre>{JSON.stringify(stockData, null, 2)}</pre>
      )}
    </div>
  );
}

export default App;
