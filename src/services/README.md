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
    refreshQuote,
    formatPrice,
    formatCurrency 
  } = useCoinQuote({ 
    autoRefresh: true, 
    refreshInterval: 15 // 15 minutes
  });

  return (
    <div>
      <p>Rate: ⓢ 1 = ${formatPrice(quote?.pricePerCoin || 0)} {formatCurrency(quote?.currency || 'USD')}</p>
      <button onClick={refreshQuote} disabled={isLoading}>
        Refresh
      </button>
    </div>
  );
}
```

## Hook Options

The `useCoinQuote` hook accepts the following options:

- `autoRefresh` (boolean, default: false) - Enable automatic refresh
- `refreshInterval` (number, default: 15) - Refresh interval in minutes
- `provider` (string, default: 'STRIPE') - Quote provider to use

## Service Features

### Caching
- Automatic 5-minute cache to reduce API calls
- Fallback to cached data if API fails
- Manual cache invalidation with `refreshQuote()`

### Error Handling
- Graceful degradation when API is unavailable
- Console warnings for failed requests
- Cached data fallback for resilience

### Utility Methods
- `formatPrice(price)` - Format price to 2 decimal places
- `formatCurrency(currency)` - Convert currency to uppercase
- `calculateUsdValue(coinAmount, quote?)` - Calculate USD equivalent

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
  autoRefresh: true, 
  refreshInterval: 15 
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
