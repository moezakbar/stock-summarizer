const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
console.log('API Key:', POLYGON_API_KEY);

// Route to fetch daily stock data
app.get('/api/stock/daily/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  try {
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?apiKey=${POLYGON_API_KEY}`
    );
    const timeSeries = response.data.results;
    if (!timeSeries) {
      return res.status(404).json({ message: 'No data found for the symbol' });
    }

    const parsedData = timeSeries.map((data) => ({
      date: data.t,  // timestamp
      adjustedClose: data.c, // adjusted close for daily data
    }));

    res.json(parsedData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock data' });
  }
});

const moment = require('moment'); // For date manipulation

// Route to fetch weekly stock data
app.get('/api/stock/weekly/:symbol', async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const today = moment();
    const sevenDaysAgo = today.clone().subtract(7, 'days').format('YYYY-MM-DD');
    const todayFormatted = today.format('YYYY-MM-DD');

    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${sevenDaysAgo}/${todayFormatted}?apiKey=${POLYGON_API_KEY}`
    );
    const timeSeries = response.data.results;
    if (!timeSeries) {
      return res.status(404).json({ message: 'No data found for the symbol' });
    }

    const parsedData = timeSeries.map((data) => ({
      date: moment(data.t).format('YYYY-MM-DD'),  // timestamp
      adjustedClose: data.c, // adjusted close for weekly data
    }));

    res.json(parsedData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock data' });
  }
});

// Route to fetch monthly stock data
app.get('/api/stock/monthly/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  try {
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/month/2024-01-01/2024-11-26?apiKey=${POLYGON_API_KEY}`
    );
    const timeSeries = response.data.results;
    if (!timeSeries) {
      return res.status(404).json({ message: 'No data found for the symbol' });
    }

    const parsedData = timeSeries.map((data) => ({
      date: data.t,  // timestamp
      adjustedClose: data.c, // adjusted close for monthly data
    }));

    res.json(parsedData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock data' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});