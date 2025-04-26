import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Clock,
  MousePointer,
  ArrowRight,
  BarChart3,
  ShoppingBag,
  Search,
  LineChart,
  MessageSquare
} from 'lucide-react';
import { AuthService } from '../services/auth';

const insights = [
  {
    title: 'Monthly Traffic',
    description: 'Estimated from various sources',
    metric: '124.5K',
    trend: 'up',
    percentage: 12.5
  },
  {
    title: 'Traffic Value',
    description: 'Estimated monthly value',
    metric: '$45.2K',
    trend: 'up',
    percentage: 8.3
  },
  {
    title: 'Top Keywords',
    description: 'Organic search positions',
    metric: '3.8K',
    trend: 'up',
    percentage: 5.7
  },
  {
    title: 'Competitors',
    description: 'In the same market segment',
    metric: '52',
    trend: 'neutral',
    percentage: 0
  }
];

const integrations = [
  {
    name: 'Google Analytics',
    description: 'Track website traffic and user behavior',
    icon: BarChart3,
    color: 'bg-blue-500',
    connectFn: () => AuthService.getInstance().connectGoogleAnalytics()
  },
  {
    name: 'Shopify',
    description: 'Connect your e-commerce data',
    icon: ShoppingBag,
    color: 'bg-green-500',
    connectFn: () => {
      const shop = prompt('Enter your Shopify store URL (e.g., my-store.myshopify.com):');
      if (shop) {
        return AuthService.getInstance().connectShopify(shop);
      }
    }
  },
  {
    name: 'Google Ads',
    description: 'Monitor advertising performance',
    icon: LineChart,
    color: 'bg-yellow-500',
    connectFn: () => AuthService.getInstance().connectGoogleAds()
  },
  {
    name: 'Search Console',
    description: 'Track search performance and issues',
    icon: Search,
    color: 'bg-red-500',
    connectFn: () => AuthService.getInstance().connectSearchConsole()
  }
];

export default function Insights() {
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (integration: typeof integrations[0]) => {
    try {
      setConnecting(integration.name);
      await integration.connectFn();
      navigate('/analytics');
    } catch (error) {
      console.error('Connection failed:', error);
      alert('Failed to connect. Please try again.');
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-peekly-light-blue p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-peekly shadow-peekly p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <img 
                src="https://peekly-fox-insights.lovable.app/lovable-uploads/32c7a0ad-7bb8-437b-a840-96df303ec58c.png" 
                alt="Peekly" 
                className="h-8 mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Website Insights
              </h1>
              <p className="text-gray-600">
                Quick overview of your website's performance and market position
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {insights.map((insight) => (
            <div
              key={insight.title}
              className="bg-white rounded-xl shadow-peekly p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {insight.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{insight.description}</p>
                </div>
                {insight.trend !== 'neutral' && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      insight.trend === 'up'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {insight.percentage}%
                  </span>
                )}
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold text-gray-900">
                  {insight.metric}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-peekly shadow-peekly p-8">
          <h2 className="text-xl font-semibold mb-6">Connect Your Data Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <button
                  key={integration.name}
                  onClick={() => handleConnect(integration)}
                  disabled={connecting === integration.name}
                  className="flex items-start p-6 border border-gray-200 rounded-xl hover:border-peekly-orange transition-colors group disabled:opacity-50"
                >
                  <div className={`${integration.color} p-3 rounded-lg text-white`}>
                    {connecting === integration.name ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="ml-4 text-left">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-peekly-orange transition-colors">
                      {integration.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {integration.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/analytics')}
            className="inline-flex items-center px-6 py-3 bg-peekly-orange text-white rounded-lg hover:bg-opacity-90 transition-colors gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Open Analytics Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}