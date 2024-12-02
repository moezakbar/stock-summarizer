import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function StockChart({ stockData, chartType }) {
  const formatStockData = (stockData, type) => {
    const labels = [];
    const prices = [];
  
    const timeSeries = stockData[type]; // weekly, or monthly
    timeSeries.forEach((data) => {
      labels.push(data.date); // Use the formatted 'date' field
      prices.push(data.adjustedClose);
    });
  
    return {
      labels: labels,  // Ensure dates are in chronological order
      datasets: [
        {
          label: `${type.toUpperCase()} Stock Price`,
          data: prices,
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
          tension: 0.1
        }
      ]
    };
  };

  return (
    <div>
      <Line data={formatStockData(stockData, chartType)} />
    </div>
  );
}

export default StockChart;