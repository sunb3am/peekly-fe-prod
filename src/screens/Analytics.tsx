import React, { useState, useContext } from 'react';
import {
  Send,
  BarChart3,
  LineChart,
  PieChart,
  Loader2
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics';
import type { ChatMessage } from '../types';
import { AnalyticsContext } from '../context/AnalyticsContext';

const COLORS = ['#FF5C28', '#10b981', '#f59e0b', '#ef4444'];

const suggestedPrompts = [
  "What's the trend in user engagement over the last week?",
  "Show me the traffic sources distribution",
  "Compare conversion rates between devices",
  "What pages have the highest bounce rates?"
];

export default function Analytics() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { propertyId, accessToken } = useContext(AnalyticsContext);
  
  const { processQuery, error } = useAnalytics(propertyId, accessToken);

  const renderChart = (data: any, type: string) => {
    const chartData = data.rows.map((row: any) => ({
      name: row.dimensionValues[0].value,
      value: parseFloat(row.metricValues[0].value)
    }));

    if (type.includes('trend') || type.includes('over time')) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsLineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#FF5C28" strokeWidth={2} />
          </RechartsLineChart>
        </ResponsiveContainer>
      );
    } else if (type.includes('distribution') || type.includes('sources')) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {chartData.map((entry: any, index: number) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#FF5C28" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    setLoading(true);
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      type: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    try {
      const analyticsData = await processQuery(message);
      
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Here's ${analyticsData.title.toLowerCase()}:\n${analyticsData.description}`,
        type: 'assistant',
        timestamp: new Date(),
        visualization: {
          type: 'chart',
          data: analyticsData
        }
      };
      
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your query. Please try again.',
        type: 'assistant',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-peekly-light-blue flex">
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <img 
          src="https://peekly-fox-insights.lovable.app/lovable-uploads/32c7a0ad-7bb8-437b-a840-96df303ec58c.png" 
          alt="Peekly" 
          className="h-8 mb-4"
        />
        <h2 className="text-lg font-semibold mb-4">Suggested Queries</h2>
        <div className="space-y-2">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="w-full text-left p-2 text-sm text-gray-700 hover:bg-peekly-light-blue rounded-lg transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.type === 'user' ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div
                className={`max-w-2xl rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-peekly-orange text-white ml-auto'
                    : 'bg-white shadow-peekly'
                }`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
                {message.visualization && (
                  <div className="mt-4 bg-white rounded-lg p-4">
                    {renderChart(message.visualization.data, message.content)}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 text-peekly-orange animate-spin" />
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSend(input);
                }}
                placeholder="Ask anything about your analytics data..."
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-peekly-orange focus:border-transparent"
              />
              <button
                onClick={() => handleSend(input)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-peekly-orange"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}