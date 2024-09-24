const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// Route to fetch stock data
app.get('/api/stock/:symbol', async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ message: 'Error fetching stock data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
