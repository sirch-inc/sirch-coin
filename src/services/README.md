# Quote Service Documentation

This document explains the centralized quote service for Sirch Coin pricing.

## Overview

The quote service provides a centralized way to fetch and cache Sirch Coin pricing information. It includes automatic caching to reduce API calls and provides utility functions for formatting.

## Architecture

### QuoteService (`src/services/quoteService.ts`)
- Singleton service for fetching quote data
- Built-in 5-minute caching to reduce API calls
- Graceful error handling with fallback to cached data
- Utility methods for formatting and calculations

### useCoinQuote Hook (`src/hooks/useCoinQuote.ts`)
- React hook wrapper around the QuoteService
- Provides state management for loading, errors, and data
- Optional auto-refresh functionality
- Easy integration with React components

## Basic Usage

### Simple Quote Display

```tsx
import { useCoinQuote } from '../../../hooks';

function QuoteDisplay() {
  const { quote, isLoading, error } = useCoinQuote();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!quote) return <div>No quote available</div>;

  return (
    <div>
      Current rate: ⓢ 1 = ${quote.pricePerCoin} {quote.currency}
    </div>
  );
}
```

### With Auto-Refresh

```tsx
import { useCoinQuote } from '../../../hooks';

function AutoRefreshQuote() {
  const { 
    quote, 
    isLoading, 
    error, 
    refreshQuote,
    lastRefresh,
    formatPrice,
    formatCurrency,
    getQuote
  } = useCoinQuote({ 
    provider: 'STRIPE'
  });

  const displayQuote = getQuote(); // Get cached quote with staleness info

  return (
    <div>
      <p>Rate: ⓢ 1 = ${formatPrice(quote?.pricePerCoin || 0)} {formatCurrency(quote?.currency || 'USD')}</p>
      {displayQuote?.isStale && (
        <p className="warning">⚠️ {displayQuote.staleReason}</p>
      )}
      <button onClick={refreshQuote}>Refresh Quote</button>
      {lastRefresh && <p>Last updated: {lastRefresh.toLocaleTimeString()}</p>}
      <p className="info">📡 Quotes automatically update every 5 minutes</p>
    </div>
  );
}

## Hook Options

The `useCoinQuote` hook accepts the following options:

- `provider` (string, default: 'STRIPE') - Quote provider to use

**Note**: Automatic polling is now handled globally by the service (every 5 minutes), so individual components no longer need to configure auto-refresh. The cache duration and polling interval are aligned to ensure users always have access to fresh data when staleness is indicated.

## Service Features

### Caching & Staleness
- Automatic 5-minute cache to reduce API calls
- Global 5-minute polling for fresh quotes (automatic background updates)
- Fallback to cached data if API fails with staleness indicators
- Manual cache invalidation with `refreshQuote()`
- `getQuote()` returns cached data with `isStale` and `staleReason` properties

### Error Handling
- Graceful degradation when API is unavailable
- Console warnings for failed requests
- Cached data fallback for resilience with staleness indicators
- Background polling continues even if individual requests fail

### Utility Methods
- `formatPrice(price)` - Format price to 2 decimal places
- `formatCurrency(currency)` - Convert currency to uppercase
- `getQuote()` - Get cached quote with staleness information
- `calculateUsdValue(coinAmount)` - Calculate USD equivalent using cached data

## Implementation Examples

### PurchaseCoins Component
```tsx
const { 
  quote, 
  isLoading, 
  error, 
  refreshQuote,
  formatPrice,
  formatCurrency 
} = useCoinQuote({ 
  provider: 'STRIPE'
});
```

### SendCoins Component
```tsx
const { quote } = useCoinQuote();

// Use in SirchCoinInput
<SirchCoinInput
  pricePerCoin={quote?.pricePerCoin || 0}
  currency={quote?.currency || 'USD'}
  showUsdValue={true}
/>
```

## Benefits

1. **Reduced API Calls**: 5-minute caching prevents excessive requests
2. **Consistent Data**: All components use the same quote source
3. **Resilient**: Graceful fallback to cached data on errors
4. **Simple Integration**: Easy-to-use React hook interface
5. **Configurable**: Optional auto-refresh with custom intervals

## Migration Guide

### Before (Individual Fetching)
```tsx
const [pricePerCoin, setPricePerCoin] = useState(0);
const [currency, setCurrency] = useState('USD');

useEffect(() => {
  const fetchQuote = async () => {
    const { data } = await supabase.functions.invoke('get-coin-purchase-quote');
    setPricePerCoin(data.pricePerCoin);
    setCurrency(data.currency);
  };
  fetchQuote();
}, []);
```

### After (Quote Service)
```tsx
const { quote } = useCoinQuote();
// Use quote.pricePerCoin and quote.currency directly
```

This approach eliminates duplicate API calls and provides a consistent, reliable way to access quote data throughout the application.
