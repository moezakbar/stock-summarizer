import React, { useState } from 'react';
import axios from 'axios';

function AIChatbot() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuerySubmit = async () => {
    setLoading(true);
    setResponse('');

    try {
      // Fetch stock news
      const newsResponse = await axios.get(`/api/stock/news`, {
        params: { symbol: query }, // Use stock symbol from query
      });

      const stockNews = newsResponse.data; // List of { title, description }
      
      // Send news data to the chatbot endpoint
      const chatbotResponse = await axios.post('/api/chatbot', { stockNews });
      setResponse(chatbotResponse.data.response);
    } catch (error) {
      console.error('Error querying chatbot:', error);
      setResponse('Failed to generate a response. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>AI Stock Chatbot</h1>
      <input
        type="text"
        placeholder="Enter a stock symbol (e.g., TSLA)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleQuerySubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Ask'}
      </button>
      {response && <p><strong>Response:</strong> {response}</p>}
    </div>
  );
}

export default AIChatbot;
