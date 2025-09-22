import React, { useState, useCallback } from 'react';
import { Input, Checkbox, Switch, Chip, Autocomplete, InputProps, CheckboxProps, SwitchProps, ChipProps, AutocompleteProps } from '@heroui/react';
import { validators } from '../utils';
import { RefreshButton } from './RefreshButton';

// Standard styling for all Sirch inputs
const SIRCH_INPUT_STYLES = {
  variant: "bordered" as const,
  size: "lg" as const,
  radius: "none" as const,
  classNames: {
    input: "bg-black text-white",
    inputWrapper: "bg-black border-white data-[hover=true]:!bg-gray-800 data-[focus=true]:!bg-gray-800 data-[focus-within=true]:!bg-gray-800 data-[invalid=true]:border-red-500",
    innerWrapper: "bg-black",
    mainWrapper: "bg-black"
  }
};

// Standard styling for all Sirch checkboxes
const SIRCH_CHECKBOX_STYLES = {
  size: "lg" as const,
  classNames: {
    wrapper: "data-[hover=true]:!bg-gray-800 data-[focus=true]:!bg-gray-800 data-[focus-visible=true]:!bg-gray-800"
  }
};

// Standard styling for all Sirch switches
const SIRCH_SWITCH_STYLES = {
  size: "lg" as const,
  classNames: {
    base: "text-black",
    wrapper: "bg-black border-white",
    thumb: "bg-white",
    startContent: "text-white",
    endContent: "text-white",
    label: "text-black"
  }
};

// Standard styling for privacy chips
const SIRCH_PRIVACY_CHIP_STYLES = {
  size: "lg" as const,
  variant: "bordered" as const,
  classNames: {
    base: "border-white hover:border-gray-300 cursor-pointer transition-colors w-20 min-w-20 select-none",
    content: "text-white font-medium select-none"
  }
};

/**
 * Standardized Input component with Sirch styling
 * Extends all HeroUI Input props
 */
export const SirchInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <Input
      ref={ref}
      {...SIRCH_INPUT_STYLES}
      {...props}
      classNames={{
        ...SIRCH_INPUT_STYLES.classNames,
        ...props.classNames
      }}
    />
  );
});

SirchInput.displayName = "SirchInput";

/**
 * Standardized Checkbox component with Sirch styling
 * Extends all HeroUI Checkbox props
 */
export const SirchCheckbox = React.forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  return (
    <Checkbox
      ref={ref}
      {...SIRCH_CHECKBOX_STYLES}
      {...props}
      classNames={{
        ...SIRCH_CHECKBOX_STYLES.classNames,
        ...props.classNames
      }}
    />
  );
});

SirchCheckbox.displayName = "SirchCheckbox";

/**
 * Standardized Switch component with Sirch styling
 * Extends all HeroUI Switch props
 */
export const SirchSwitch = React.forwardRef<HTMLInputElement, SwitchProps>((props, ref) => {
  return (
    <Switch
      ref={ref}
      {...SIRCH_SWITCH_STYLES}
      {...props}
      classNames={{
        ...SIRCH_SWITCH_STYLES.classNames,
        ...props.classNames
      }}
    />
  );
});

SirchSwitch.displayName = "SirchSwitch";

/**
 * Privacy toggle chip component - better UX for Private/Public toggles
 * Shows "Private" when selected, appears muted when not selected
 */
export const SirchPrivacyChip = React.forwardRef<HTMLDivElement, 
  Omit<ChipProps, 'children'> & { 
    isPrivate: boolean; 
    onPrivacyChange: (isPrivate: boolean) => void;
  }
>((props, ref) => {
  const { isPrivate, onPrivacyChange, ...chipProps } = props;
  
  return (
    <Chip
      ref={ref}
      {...SIRCH_PRIVACY_CHIP_STYLES}
      {...chipProps}
      variant={isPrivate ? "solid" : "bordered"}
      color={isPrivate ? "default" : "default"}
      onClick={() => onPrivacyChange(!isPrivate)}
      classNames={{
        ...SIRCH_PRIVACY_CHIP_STYLES.classNames,
        base: `${SIRCH_PRIVACY_CHIP_STYLES.classNames.base} ${isPrivate ? 'bg-white text-black border-white' : 'bg-black'}`,
        content: `${SIRCH_PRIVACY_CHIP_STYLES.classNames.content} ${isPrivate ? 'text-black' : 'text-white'}`,
        ...props.classNames
      }}
    >
      Private
    </Chip>
  );
});

SirchPrivacyChip.displayName = "SirchPrivacyChip";

/**
 * Email input with common email-specific props
 */
export const SirchEmailInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>((props, ref) => {
  return (
    <SirchInput
      ref={ref}
      type="email"
      autoComplete="email"
      {...props}
    />
  );
});

SirchEmailInput.displayName = "SirchEmailInput";

interface SirchValidatedEmailInputProps extends Omit<InputProps, 'type' | 'isInvalid' | 'errorMessage'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRequired?: boolean;
}

/**
 * Email input with built-in validation that shows errors only on blur
 * Provides consistent email validation behavior across the app
 * Handles both format validation and required field validation
 */
export const SirchValidatedEmailInput = React.forwardRef<HTMLInputElement, SirchValidatedEmailInputProps>((props, ref) => {
  const { value, onChange, onBlur, isRequired = false, ...otherProps } = props;
  const [emailBlurred, setEmailBlurred] = useState<boolean>(false);

  // Email validation using shared utility
  const emailValidation = validators.email(value);
  const isEmailValid = emailValidation.isValid;
  
  // Handle required validation
  const isEmpty = !value || value.trim() === '';
  const isRequiredError = isRequired && isEmpty && emailBlurred;
  const isFormatError = !isEmpty && !isEmailValid && emailBlurred;
  
  const emailError = isRequiredError 
    ? "Email is required" 
    : isFormatError 
      ? emailValidation.message 
      : undefined;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    if (emailBlurred) {
      setEmailBlurred(false); // Reset blur state when user starts typing again
    }
  }, [onChange, emailBlurred]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setEmailBlurred(true);
    onBlur?.(e);
  }, [onBlur]);

  return (
    <SirchInput
      ref={ref}
      type="email"
      autoComplete="email"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      isInvalid={!!emailError}
      errorMessage={emailError}
      isRequired={isRequired}
      {...otherProps}
    />
  );
});

SirchValidatedEmailInput.displayName = "SirchValidatedEmailInput";

/**
 * Number input with common number-specific props
 */
export const SirchNumberInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>((props, ref) => {
  return (
    <SirchInput
      ref={ref}
      type="number"
      {...props}
    />
  );
});

SirchNumberInput.displayName = "SirchNumberInput";

/**
 * Text input with common text-specific props
 */
export const SirchTextInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>((props, ref) => {
  return (
    <SirchInput
      ref={ref}
      type="text"
      {...props}
    />
  );
});

SirchTextInput.displayName = "SirchTextInput";

/**
 * Password input with common password-specific props
 */
export const SirchPasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>((props, ref) => {
  return (
    <SirchInput
      ref={ref}
      type="password"
      {...props}
    />
  );
});

SirchPasswordInput.displayName = "SirchPasswordInput";

// Standard styling for all Sirch autocomplete components
const SIRCH_AUTOCOMPLETE_STYLES = {
  variant: "bordered" as const,
  size: "lg" as const,
  radius: "none" as const,
  inputProps: {
    classNames: {
      input: "bg-black text-white",
      inputWrapper: "bg-black border-white data-[hover=true]:!bg-gray-800 data-[focus=true]:!bg-gray-800 data-[focus-within=true]:!bg-gray-800 data-[invalid=true]:border-red-500"
    }
  },
  classNames: {
    base: "bg-black text-white",
    endContentWrapper: "!text-white",
    selectorButton: "!text-white !opacity-100"
  }
};

/**
 * Standardized Autocomplete component with Sirch styling
 * Extends all HeroUI Autocomplete props
 */
export const SirchAutocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>((props, ref) => {
  return (
    <Autocomplete
      ref={ref}
      {...SIRCH_AUTOCOMPLETE_STYLES}
      {...props}
      inputProps={{
        ...SIRCH_AUTOCOMPLETE_STYLES.inputProps,
        ...props.inputProps,
        classNames: {
          ...SIRCH_AUTOCOMPLETE_STYLES.inputProps.classNames,
          ...props.inputProps?.classNames
        }
      }}
      classNames={{
        ...SIRCH_AUTOCOMPLETE_STYLES.classNames,
        ...props.classNames
      }}
    />
  );
});

SirchAutocomplete.displayName = "SirchAutocomplete";

interface SirchCoinInputProps extends Omit<InputProps, 'type' | 'startContent'> {
  amount: string;
  pricePerCoin?: number;
  currency?: string;
  showUsdValue?: boolean;
  onRefreshQuote?: () => void;
  isRefreshLoading?: boolean;
}

/**
 * Specialized input for Sirch Coin amounts with built-in USD conversion display
 * Shows ⓢ symbol in startContent and USD equivalent in endContent when applicable
 */
export const SirchCoinInput = React.forwardRef<HTMLInputElement, SirchCoinInputProps>((props, ref) => {
  const { amount, pricePerCoin = 0, currency = "USD", showUsdValue = true, onRefreshQuote, isRefreshLoading = false, ...otherProps } = props;
  
  // Calculate USD equivalent
  const usdValue = React.useMemo(() => {
    const numAmount = parseFloat(amount);
    return numAmount && !isNaN(numAmount) && pricePerCoin > 0 ? numAmount * pricePerCoin : 0;
  }, [amount, pricePerCoin]);

  const formatPrice = (price: number): string => {
    return Number(price).toFixed(2);
  };

  const formatCurrency = (curr: string): string => {
    return curr.toUpperCase();
  };

  return (
    <SirchInput
      ref={ref}
      type="number"
      startContent={
        <div className="pointer-events-none flex items-center text-white">
          <span className="text-medium text-white font-bold">ⓢ</span>
        </div>
      }
      endContent={
        <div className="flex items-center gap-2">
          {showUsdValue && usdValue > 0 && (
            <>
              <div className="pointer-events-none flex items-center text-gray-400">
                <span className="text-small whitespace-nowrap">
                  ${formatPrice(usdValue)} {formatCurrency(currency)}
                </span>
              </div>
              {onRefreshQuote && (
                <RefreshButton 
                  onRefresh={onRefreshQuote} 
                  isLoading={isRefreshLoading}
                />
              )}
            </>
          )}
        </div>
      }
      {...otherProps}
    />
  );
});

SirchCoinInput.displayName = "SirchCoinInput";

// Export RefreshButton
export { RefreshButton } from './RefreshButton';
