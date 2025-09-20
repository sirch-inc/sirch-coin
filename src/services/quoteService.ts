import supabase from '../pages/Main/_common/supabaseProvider';

export interface CoinQuote {
  pricePerCoin: number;
  currency: string;
  minimumPurchase: number;
  lastUpdated: Date;
  isStale?: boolean;
  staleReason?: string;
}

export interface QuoteServiceOptions {
  provider?: string;
}

export class QuoteService {
  private static instance: QuoteService;
  private cachedQuote: CoinQuote | null = null;
  private lastFetchTime: Date | null = null;
  private readonly CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
  private readonly POLLING_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes - aligned with staleness
  private pollingTimer: NodeJS.Timeout | null = null;
  private subscribers: Set<() => void> = new Set();

  static getInstance(): QuoteService {
    if (!QuoteService.instance) {
      QuoteService.instance = new QuoteService();
    }
    return QuoteService.instance;
  }

  constructor() {
    this.startPolling();
  }

  async getQuote(options: QuoteServiceOptions = {}): Promise<CoinQuote> {
    const { provider = 'STRIPE' } = options;

    // Return cached quote if it's still fresh
    if (this.isCacheValid()) {
      return this.cachedQuote!;
    }

    try {
      const { data, error } = await supabase.functions.invoke('get-coin-purchase-quote', {
        body: { purchaseProvider: provider }
      });

      if (error) {
        throw new Error(error);
      }

      if (!data) {
        throw new Error("No quote was returned.");
      }

      const quote: CoinQuote = {
        pricePerCoin: parseFloat(data.pricePerCoin.toString()),
        currency: data.currency,
        minimumPurchase: data.minimumPurchase,
        lastUpdated: new Date(),
      };

      // Cache the quote
      this.cachedQuote = quote;
      this.lastFetchTime = new Date();

      return quote;
    } catch (error) {
      // If we have a cached quote and the fetch fails, return the cached version with stale indicators
      if (this.cachedQuote) {
        console.warn('Failed to fetch fresh quote, using cached version:', error);
        return {
          ...this.cachedQuote,
          isStale: true,
          staleReason: 'Network error - using cached data'
        };
      }
      throw error;
    }
  }

  async refreshQuote(options: QuoteServiceOptions = {}): Promise<CoinQuote> {
    // Force a fresh fetch by clearing cache
    this.cachedQuote = null;
    this.lastFetchTime = null;
    return this.getQuote(options);
  }

  // Get cached quote regardless of cache validity - for display purposes
  getCachedQuote(): CoinQuote | null {
    if (!this.cachedQuote) return null;
    
    // Check if the cached data is stale (older than cache duration)
    const isStale = !this.isCacheValid();
    
    if (isStale) {
      return {
        ...this.cachedQuote,
        isStale: true,
        staleReason: 'Quote data is older than 5 minutes'
      };
    }
    
    return this.cachedQuote;
  }

  private isCacheValid(): boolean {
    if (!this.cachedQuote || !this.lastFetchTime) {
      return false;
    }

    const now = new Date();
    const timeDiff = now.getTime() - this.lastFetchTime.getTime();
    return timeDiff < this.CACHE_DURATION_MS;
  }

  // Utility methods
  formatPrice(price: number): string {
    return Number(price).toFixed(2);
  }

  formatCurrency(currency: string): string {
    return currency.toUpperCase();
  }

  // Polling and subscription methods
  private startPolling(): void {
    // Start polling after initial delay to allow components to mount
    setTimeout(() => {
      this.pollingTimer = setInterval(() => {
        this.pollForQuote();
      }, this.POLLING_INTERVAL_MS);
    }, 1000);
  }

  private async pollForQuote(): Promise<void> {
    try {
      // Only poll if we don't have fresh data
      if (!this.isCacheValid()) {
        await this.getQuote();
        this.notifySubscribers();
      }
    } catch (error) {
      console.warn('Background quote polling failed:', error);
    }
  }

  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in quote subscription callback:', error);
      }
    });
  }

  destroy(): void {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
    this.subscribers.clear();
  }
}

// Export a singleton instance for easy use
export const quoteService = QuoteService.getInstance();
