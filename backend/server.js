import OpenAI from 'openai'; // import OpenAI class
import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import moment from 'moment';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

// Initialize OpenAI API client with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

// Route to fetch company name based on stock symbol
app.get('/api/stock/company/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  
  try {
    // Fetch company info using Polygon API or another source
    const companyInfoResponse = await axios.get(
      `https://api.polygon.io/v3/reference/tickers?ticker=${symbol}&active=true&limit=100&apiKey=${POLYGON_API_KEY}`
    );

    // Check if results exist and get the company name
    if (companyInfoResponse.data.results && companyInfoResponse.data.results.length > 0) {
      const companyName = companyInfoResponse.data.results[0].name;
      res.json({ name: companyName });
    } else {
      res.status(404).json({ error: 'Company not found' });
    }
  } catch (error) {
    console.error('Error fetching company data:', error);
    res.status(500).json({ error: 'Error fetching company information' });
  }
});

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

// const moment = require('moment'); // For date manipulation

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
    const today = moment();
    const thirtyDaysAgo = today.clone().subtract(30, 'days').format('YYYY-MM-DD');
    const todayFormatted = today.format('YYYY-MM-DD');

    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${thirtyDaysAgo}/${todayFormatted}?apiKey=${POLYGON_API_KEY}`
    );
    const timeSeries = response.data.results;
    if (!timeSeries) {
      return res.status(404).json({ message: 'No data found for the symbol' });
    }

    const parsedData = timeSeries.map((data) => ({
      date: moment(data.t).format('YYYY-MM-DD'),  // timestamp
      adjustedClose: data.c, // adjusted close for monthly data
    }));

    res.json(parsedData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock data' });
  }
});


// Route to fetch stock news from Polygon API
app.get('/api/stock/news', async (req, res) => {
  const { symbol } = req.query; // Symbol passed as a query parameter
  if (!symbol) {
    return res.status(400).json({ error: 'Stock symbol is required' });
  }

  try {
    const response = await axios.get(
      `https://api.polygon.io/v2/reference/news?ticker=${symbol}&limit=5&apiKey=${POLYGON_API_KEY}`
    );

    const newsArticles = response.data.results.map((article) => ({
      title: article.title,
      description: article.description,
    }));

    res.json(newsArticles);
  } catch (error) {
    console.error('Error fetching news:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch stock news' });
  }
});

// Existing Chatbot Route
app.post('/api/chatbot', async (req, res) => {
  const { stockNews } = req.body;
  if (!stockNews || stockNews.length === 0) {
    return res.status(400).json({ error: 'No news provided' });
  }

  try {
    // Concatenate news titles and descriptions into a readable format
    const newsText = stockNews
      .map((news, index) => `${index + 1}. Title: "${news.title}"\n   Description: ${news.description}`)
      .join('\n\n');

    const prompt = `
    You are a financial analyst AI that explains stock market movements based on news. Below are some news articles related to a stock. Analyze the provided articles and provide a clear and concise summary of why the stock might be up or down, as well as any other key insights or trends that are noticeable.
    
    ### News Articles
    ${newsText}
    
    ### Instructions
    1. Summarize the main reasons why the stock might be up or down based on the news.
    2. If there's insufficient information to determine a trend, explain this.
    3. Use plain language and make the response understandable for a general audience.
    4. Provide actionable insights, if any.
    
    Your response:
        `;
  
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: "You are a financial market expert and stock news analyst." },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500, // Adjust as needed
    });

    res.json({ response: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error with OpenAI API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error generating chatbot response' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});