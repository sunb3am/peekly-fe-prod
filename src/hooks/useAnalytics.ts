import { useState, useEffect } from 'react';
import { AnalyticsService } from '../services/analytics';

export function useAnalytics(propertyId: string, accessToken: string) {
  const [analyticsService, setAnalyticsService] = useState<AnalyticsService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const service = new AnalyticsService(propertyId, accessToken);
      setAnalyticsService(service);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [propertyId, accessToken]);

  const getInsights = async (industry: string) => {
    if (!analyticsService) throw new Error('Analytics service not initialized');
    return await analyticsService.getKeyInsights(industry);
  };

  const processQuery = async (query: string) => {
    if (!analyticsService) throw new Error('Analytics service not initialized');
    return await analyticsService.processNaturalLanguageQuery(query);
  };

  return {
    loading,
    error,
    getInsights,
    processQuery
  };
}