import './App.css';
import React, { useState } from 'react';
import StockForm from './StockForm';
import NavigationBar from './navbar';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AIChatbot from './AIChatbot';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('daily');

  const getStockData = async (symbol) => {
    try {
      const dailyResponse = await axios.get(`/api/stock/daily/${symbol}`);
      const weeklyResponse = await axios.get(`/api/stock/weekly/${symbol}`);
      const monthlyResponse = await axios.get(`/api/stock/monthly/${symbol}`);
      
      // Process the responses to format the data
      const dailyData = dailyResponse.data['Time Series (Daily)'];
      const weeklyData = weeklyResponse.data['Weekly Time Series'];
      const monthlyData = monthlyResponse.data['Monthly Time Series'];

      setStockData({
        daily: dailyData,
        weekly: weeklyData,
        monthly: monthlyData
      });
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Could not fetch stock data. Please try again.');
    }
  };

  const formatStockData = (stockData, type) => {
    const labels = [];
    const prices = [];
  
    const timeSeries = stockData[type]; // daily, weekly, or monthly
    for (let date in timeSeries) {
      labels.push(date);
      prices.push(timeSeries[date]['4. close']);
    }
  
    return {
      labels: labels.reverse(),  // Ensure dates are in chronological order
      datasets: [
        {
          label: `${type.toUpperCase()} Stock Price`,
          data: prices.reverse(),
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
          tension: 0.1
        }
      ]
    };
  };
  
  
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={
          <div>
            <h1>Stock Price Summarizer</h1>
            <StockForm getStockData={getStockData} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {stockData && (
              <div>
                <Line data={formatStockData(stockData, chartType)} />
                <div style={{ marginTop: '20px' }}>
                  <button onClick={() => setChartType('daily')}>Daily</button>
                  <button onClick={() => setChartType('weekly')}>Weekly</button>
                  <button onClick={() => setChartType('monthly')}>Monthly</button>
                </div>
              </div>
            )}
          </div>
        } />
        <Route path="/chatbot" element={<AIChatbot />} /> {/* Add route for AI Chatbot */}
      </Routes>
    </Router>
  );
}

export default App;
