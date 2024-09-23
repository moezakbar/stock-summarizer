import './App.css';
import React, { useState } from 'react';
import StockForm from './StockForm';
import axios from 'axios';

function App() {
  const [stockData, setStockData] = useState(null);
  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

  const getStockData = async (symbol) => {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`
      );
      setStockData(response.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };
  
  
  return (
    <div>
      <h1>Stock Price Summarizer</h1>
      <StockForm getStockData={getStockData} />
      {stockData ? (
        <pre>{JSON.stringify(stockData, null, 2)}</pre>
      ) : (
        <p>No data yet.</p>
      )}
    </div>
  );
}

export default App;
