import { useState, useEffect, useContext, useCallback } from 'react';
import { quoteService, CoinQuote } from '../services/quoteService';
import { AuthContext } from '../pages/Main/_common/AuthContext';

interface UseCoinQuoteOptions {
  provider?: string;
}

export function useCoinQuote(options: UseCoinQuoteOptions = {}) {
  const {
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

  // Subscribe to quote updates from the service
  useEffect(() => {
    if (!userInTable) return;

    const unsubscribe = quoteService.subscribe(() => {
      // Update quote state when service notifies of new data
      const updatedQuote = quoteService.getCachedQuote();
      if (updatedQuote) {
        setQuote(updatedQuote);
        setLastRefresh(new Date());
      }
    });

    return unsubscribe;
  }, [userInTable]);

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
      return quote ? coinAmount * quote.pricePerCoin : null;
    },
  };
}
