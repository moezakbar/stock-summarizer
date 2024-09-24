import './App.css';
import React, { useState } from 'react';
import StockForm from './StockForm';
import NavigationBar from './navbar';
import axios from 'axios';

function App() {
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  const getStockData = async (symbol) => {
    try {
      const response = await axios.get(`/api/stock/${symbol}`);
      setStockData(response.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Could not fetch stock data. Please try again.');
    }
  };
  
  
  return (
    <div>
      <NavigationBar /> {/* Rendering the NavigationBar component */}
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
