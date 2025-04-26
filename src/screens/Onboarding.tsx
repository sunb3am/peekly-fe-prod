import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/insights');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-peekly-light-blue flex items-center justify-center p-6">
      <div className="bg-white rounded-peekly shadow-peekly w-full max-w-2xl p-8">
        <div className="flex items-center space-x-2 mb-8">
          <img 
            src="https://peekly-fox-insights.lovable.app/lovable-uploads/32c7a0ad-7bb8-437b-a840-96df303ec58c.png" 
            alt="Peekly" 
            className="h-8"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Ask Your Data Anything.</h2>
          <p className="text-gray-600">
            Connect your data sources and get instant answers, insights, and visualizations through natural language.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <input
              type="url"
              required
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-peekly-orange focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-peekly-orange text-white rounded-lg px-4 py-3 flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Start Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          No credit card required
        </p>
      </div>
    </div>
  );
}