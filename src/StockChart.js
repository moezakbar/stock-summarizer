import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function StockChart({ stockData, chartType, setHoveredPrice, resetPrice }) {
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
          borderColor: 'rgba(97, 250, 148)',
          fill: false,
          tension: 0.1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Tooltip background color
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: {
        grid: {
          drawOnChartArea: false, // Disable grid lines in the middle of the chart
          drawBorder: true, // Draw border line along the x-axis
          drawTicks: true, // Draw tick marks on the x-axis
          color: 'rgba(0, 0, 0, 0.1)', // Border color
        },
        ticks: {
          color: 'black', // Black ticks for x-axis
        },
      },
      y: {
        grid: {
          drawOnChartArea: false, // Disable grid lines in the middle of the chart
          drawBorder: true, // Draw border line along the y-axis
          drawTicks: true, // Draw tick marks on the y-axis
          color: 'rgba(0, 0, 0, 0.1)', // Border color
        },
        ticks: {
          color: 'black', // Black ticks for y-axis
        },
      },
    },
    onHover: (event, chartElement) => {
      if (chartElement.length > 0) {
        const index = chartElement[0].index;
        const hoveredPrice = stockData[chartType][index].adjustedClose;
        setHoveredPrice(hoveredPrice); // Update the hovered price
      } else {
        resetPrice(); // Reset to the original price
      }
    },
  };

  return (
    <div>
      <Line data={formatStockData(stockData, chartType)} options={chartOptions} />
    </div>
  );
}

export default StockChart;