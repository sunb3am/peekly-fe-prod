export interface OnboardingData {
  websiteUrl: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  visualization?: {
    type: 'chart' | 'metric';
    data: any;
  };
}

export interface Insight {
  title: string;
  description: string;
  metric: string | number;
  trend: 'up' | 'down' | 'neutral';
  percentage: number;
}

export interface Integration {
  name: string;
  description: string;
  icon: any;
  color: string;
  connectFn: () => Promise<void>;
}

export interface AuthTokens {
  googleAnalytics?: string;
  googleAds?: string;
  searchConsole?: string;
  shopify?: string;
}