import { type AuthTokens } from '../types';

export class AuthService {
  private static instance: AuthService;
  private shopifyAccessToken: string | null = null;
  private googleAnalyticsToken: string | null = null;
  private googleAdsToken: string | null = null;
  private searchConsoleToken: string | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async authenticateWithGoogle(scope: string[]): Promise<string> {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    
    // Create the OAuth URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('response_type', 'token');
    authUrl.searchParams.append('scope', scope.join(' '));
    
    // Open Google login in a popup
    const popup = window.open(
      authUrl.toString(),
      'Google Login',
      'width=600,height=600'
    );
    
    return new Promise((resolve, reject) => {
      window.addEventListener('message', (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          const { access_token } = event.data;
          resolve(access_token);
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          reject(new Error('Authentication failed'));
        }
      });
    });
  }

  async connectGoogleAnalytics(): Promise<void> {
    try {
      const token = await this.authenticateWithGoogle([
        'https://www.googleapis.com/auth/analytics.readonly'
      ]);
      this.googleAnalyticsToken = token;
    } catch (error) {
      console.error('Failed to connect to Google Analytics:', error);
      throw error;
    }
  }

  async connectGoogleAds(): Promise<void> {
    try {
      const token = await this.authenticateWithGoogle([
        'https://www.googleapis.com/auth/adwords'
      ]);
      this.googleAdsToken = token;
    } catch (error) {
      console.error('Failed to connect to Google Ads:', error);
      throw error;
    }
  }

  async connectSearchConsole(): Promise<void> {
    try {
      const token = await this.authenticateWithGoogle([
        'https://www.googleapis.com/auth/webmasters'
      ]);
      this.searchConsoleToken = token;
    } catch (error) {
      console.error('Failed to connect to Search Console:', error);
      throw error;
    }
  }

  async connectShopify(shop: string): Promise<void> {
    const clientId = import.meta.env.VITE_SHOPIFY_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/shopify/callback`;
    
    const shopifyAuthUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=read_products,read_orders&redirect_uri=${encodeURIComponent(redirectUri)}`;

    const popup = window.open(shopifyAuthUrl, 'Shopify Login', 'width=600,height=600');

    return new Promise((resolve, reject) => {
      window.addEventListener('message', (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'SHOPIFY_AUTH_SUCCESS') {
          this.shopifyAccessToken = event.data.token;
          resolve();
        } else if (event.data.type === 'SHOPIFY_AUTH_ERROR') {
          reject(new Error('Shopify authentication failed'));
        }
      });
    });
  }

  getTokens(): AuthTokens {
    return {
      googleAnalytics: this.googleAnalyticsToken,
      googleAds: this.googleAdsToken,
      searchConsole: this.searchConsoleToken,
      shopify: this.shopifyAccessToken
    };
  }
}