# Sirch Form Components Documentation

## Overview

The `HeroUIFormComponents.tsx` file provides standardized, reusable form components that maintain consistent styling across the Sirch application.

## Available Components

### Base Components

#### `SirchInput`
- **Purpose**: Base input component with standard Sirch styling
- **Extends**: All HeroUI Input props
- **Features**:
  - Black background with white text
  - White borders with red error states
  - Large size, bordered variant, no border radius
  - Allows prop overrides for customization

#### `SirchCheckbox`
- **Purpose**: Base checkbox component with standard Sirch styling
- **Extends**: All HeroUI Checkbox props
- **Features**:
  - Large size
  - Consistent with Sirch design system

### Specialized Input Components

#### `SirchEmailInput`
- **Purpose**: Email-specific input
- **Features**: 
  - Pre-configured with `type="email"`
  - Includes `autoComplete="email"`
  - Extends SirchInput styling

#### `SirchNumberInput`
- **Purpose**: Number-specific input
- **Features**:
  - Pre-configured with `type="number"`
  - Extends SirchInput styling
  - Supports min, max, step attributes

#### `SirchTextInput`
- **Purpose**: Text-specific input
- **Features**:
  - Pre-configured with `type="text"`
  - Extends SirchInput styling

#### `SirchCoinInput`
- **Purpose**: Specialized input for Sirch Coin amounts with USD conversion
- **Features**:
  - Pre-configured with `type="number"`
  - Shows ⓢ symbol in startContent
  - Displays USD equivalent in endContent when amount > 0
  - Built-in price calculation and formatting
  - Optional refresh icon for quote updates
  - Supports all SirchInput props plus `amount`, `pricePerCoin`, `currency`, `showUsdValue`, `onRefreshQuote`

## Usage Examples

```tsx
import { SirchEmailInput, SirchTextInput, SirchNumberInput, SirchCheckbox } from './HeroUIFormComponents';

// Email input with validation
<SirchEmailInput
  label="Email Address"
  placeholder="Enter your email"
  value={email}
  onChange={handleEmailChange}
  isRequired
  isInvalid={hasError}
  errorMessage="Please enter a valid email"
/>

// Number input with constraints
<SirchNumberInput
  label="Amount"
  placeholder="Enter amount"
  value={amount}
  onChange={handleAmountChange}
  min="1"
  max="100"
  step="1"
/>

// Text input with custom props
<SirchTextInput
  label="Name"
  placeholder="Enter your name"
  value={name}
  onChange={handleNameChange}
  maxLength={50}
/>

// Sirch Coin input with USD conversion and refresh capability
<SirchCoinInput
  label="Amount"
  placeholder="How many ⓢ coins?"
  amount={coinAmount}
  value={coinAmount}
  onChange={handleAmountChange}
  pricePerCoin={1.50}
  currency="USD"
  showUsdValue={true}
  onRefreshQuote={handleRefreshQuote}
  min="1"
  step="1"
/>

// Checkbox with custom content
<SirchCheckbox
  isSelected={isPrivate}
  onValueChange={setIsPrivate}
>
  Keep my information private
</SirchCheckbox>
```

## Benefits

1. **Consistency**: All form inputs have the same visual appearance
2. **Maintainability**: Style changes only need to be made in one place
3. **Reusability**: Easy to use across different components
4. **Type Safety**: Full TypeScript support with proper prop types
5. **Flexibility**: All original HeroUI props are still available for customization

## Migration

Components using the old pattern:
```tsx
<Input
  type="email"
  variant="bordered"
  size="lg" 
  radius="none"
  classNames={{
    input: "bg-black text-white",
    inputWrapper: "bg-black border-white"
  }}
  // ... other props
/>
```

Should be replaced with:
```tsx
<SirchEmailInput
  // ... other props (variant, size, radius, classNames are automatic)
/>
```

## Currently Used In

- `SendCoins.tsx` - Amount and memo inputs
- `UpdateAccount.tsx` - Email, name, and user handle inputs
- Future components should use these standardized components
