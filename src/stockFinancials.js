import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams
import { Bar, Pie } from 'react-chartjs-2';

// Import and register necessary chart elements
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StockFinancials = () => {
    const { ticker } = useParams(); // Extract ticker from the URL
    const [financialData, setFinancialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFinancials = async () => {
            try {
                const response = await axios.get(`/api/stock/financials/${ticker}`);
                setFinancialData(response.data);
            } catch (err) {
                setError('Error fetching financial data.');
            } finally {
                setLoading(false);
            }
        };

        if (ticker) fetchFinancials();
    }, [ticker]);

    if (loading) return <div>Loading financial data...</div>;
    if (error) return <div>{error}</div>;

    // Chart setup
    const barData = {
        labels: ['Assets', 'Liabilities', 'Equity'],
        datasets: [
        {
            label: 'USD ($)',
            data: [
            financialData.balance_sheet.assets.value,
            financialData.balance_sheet.liabilities.value,
            financialData.balance_sheet.equity.value,
            ],
            backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
        },
        ],
    };

    const pieData = {
        labels: ['Operating', 'Investing', 'Financing'],
        datasets: [
        {
            data: [
            financialData.cash_flow_statement.net_cash_flow_from_operating_activities.value,
            financialData.cash_flow_statement.net_cash_flow_from_investing_activities.value,
            financialData.cash_flow_statement.net_cash_flow_from_financing_activities.value,
            ],
            backgroundColor: ['#ff9800', '#3f51b5', '#e91e63'],
        },
        ],
    };

    return (
        <div>
        <h2>Financial Data for {ticker}</h2>
        <div style={{ maxWidth: '600px', margin: '20px auto' }}>
            <Bar data={barData} />
        </div>
        <div style={{ maxWidth: '600px', margin: '20px auto' }}>
            <Pie data={pieData} />
        </div>
        </div>
    );
};

export default StockFinancials;
