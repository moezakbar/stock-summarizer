// src/StockForm.js
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import './css/StockForm.css';

function StockForm({ getStockData }) {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol) {
      getStockData(symbol);  // Call the function passed as a prop
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ marginBottom: '20px' }} className="form-container">
      <Form.Group controlId="formStockSymbol">
        <Form.Label>Stock Symbol</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter stock symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Search
      </Button>
    </Form>
  );
}

export default StockForm;
