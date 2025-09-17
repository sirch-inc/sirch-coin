import { useState, useEffect, useContext, useCallback } from 'react';
import { quoteService, CoinQuote } from '../services/quoteService';
import { AuthContext } from '../pages/Main/_common/AuthContext';

interface UseCoinQuoteOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in minutes
  provider?: string;
}

export function useCoinQuote(options: UseCoinQuoteOptions = {}) {
  const {
    autoRefresh = false,
    refreshInterval = 15,
    provider = 'STRIPE'
  } = options;

  const [quote, setQuote] = useState<CoinQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const auth = useContext(AuthContext);
  const userInTable = auth?.userInTable;

  const fetchQuote = useCallback(async (forceRefresh = false) => {
    if (!userInTable) return;

    setIsLoading(true);
    setError(null);

    try {
      const newQuote = forceRefresh 
        ? await quoteService.refreshQuote({ provider })
        : await quoteService.getQuote({ provider });

      setQuote(newQuote);
      setLastRefresh(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error('Failed to fetch quote:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userInTable, provider]);

  // Initial fetch
  useEffect(() => {
    if (userInTable) {
      fetchQuote();
    }
  }, [userInTable, fetchQuote]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !userInTable) return;

    const intervalMs = refreshInterval * 60 * 1000;
    const interval = setInterval(() => {
      fetchQuote();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, userInTable, fetchQuote]);

  const refreshQuote = async () => {
    await fetchQuote(true);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    quote,
    isLoading,
    error,
    lastRefresh,
    refreshQuote,
    clearError,
    // Utility functions
    formatPrice: quoteService.formatPrice,
    formatCurrency: quoteService.formatCurrency,
    // Get quote (may be stale with indicators)
    getQuote: () => quoteService.getCachedQuote(),
    calculateUsdValue: (coinAmount: number) => {
      const cachedQuote = quoteService.getCachedQuote();
      return cachedQuote ? coinAmount * cachedQuote.pricePerCoin : null;
    },
  };
}
