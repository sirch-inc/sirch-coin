import supabase from '../pages/Main/_common/supabaseProvider';

export interface CoinQuote {
  pricePerCoin: number;
  currency: string;
  minimumPurchase: number;
  lastUpdated: Date;
}

export interface QuoteServiceOptions {
  provider?: string;
}

export class QuoteService {
  private static instance: QuoteService;
  private cachedQuote: CoinQuote | null = null;
  private lastFetchTime: Date | null = null;
  private readonly CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  static getInstance(): QuoteService {
    if (!QuoteService.instance) {
      QuoteService.instance = new QuoteService();
    }
    return QuoteService.instance;
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
      // If we have a cached quote and the fetch fails, return the cached version
      if (this.cachedQuote) {
        console.warn('Failed to fetch fresh quote, using cached version:', error);
        return this.cachedQuote;
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

  getCachedQuote(): CoinQuote | null {
    return this.cachedQuote;
  }

  getLastFetchTime(): Date | null {
    return this.lastFetchTime;
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

  calculateUsdValue(coinAmount: number, quote?: CoinQuote): number {
    const activeQuote = quote || this.cachedQuote;
    return activeQuote ? coinAmount * activeQuote.pricePerCoin : 0;
  }
}

// Export a singleton instance for easy use
export const quoteService = QuoteService.getInstance();
