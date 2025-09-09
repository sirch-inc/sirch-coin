# Email Validation Upgrade Guide

## New Component: `SirchValidatedEmailInput`

We've created a new enhanced email input component that provides consistent validation behavior across the app.

### Features
- **Blur-based validation**: Shows errors only when user leaves the field
- **Smart error handling**: Hides errors when user starts typing again
- **Empty field handling**: No errors shown for empty fields
- **Consistent styling**: Uses existing Sirch design system
- **Built-in validation**: Uses shared validators utility

### Usage

Replace existing `SirchEmailInput` usage:

```tsx
// OLD - Manual validation required
<SirchEmailInput
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  isInvalid={hasError}
  errorMessage={errorMessage}
/>

// NEW - Validation built-in
<SirchValidatedEmailInput
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  label="Email Address"
  placeholder="Enter your email"
/>
```

### Components to Update

1. **Login.tsx** - Simple email/password form
2. **CreateAccount.tsx** - Already uses form validation hooks, but could benefit from consistent UX
3. **UpdateAccount.tsx** - User profile email updates

### Implementation Steps

1. Import the new component:
```tsx
import { SirchValidatedEmailInput } from '../../../../components/HeroUIFormComponents';
```

2. Replace `SirchEmailInput` with `SirchValidatedEmailInput`

3. Remove manual validation logic for email fields (if any)

4. The component handles all validation internally

### Benefits

- **Consistent UX**: All email inputs behave the same way
- **Less code**: No need for manual validation state management
- **Better UX**: No jarring validation messages while typing
- **Maintainable**: Single source of truth for email validation behavior

## Implementation Example

The ResetPasswordRequest component has been updated as the reference implementation:

```tsx
// Simple, clean usage
<SirchValidatedEmailInput
  label="Email Address"
  placeholder="Your Sirch Coins account email address"
  value={userEmail}
  onChange={(e) => setUserEmail(e.target.value)}
  isRequired
/>
```

All validation, error handling, and UX behavior is handled internally by the component.
