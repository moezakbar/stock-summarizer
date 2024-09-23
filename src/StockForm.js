// src/StockForm.js
import React, { useState } from 'react';

function StockForm({ getStockData }) {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol) {
      getStockData(symbol);  // Call the function passed as a prop
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter stock symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <button type="submit">Get Stock Data</button>
    </form>
  );
}

export default StockForm;
