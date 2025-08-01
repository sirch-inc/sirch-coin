import React from 'react';
import { Input, Checkbox, Switch, Chip, InputProps, CheckboxProps, SwitchProps, ChipProps } from '@heroui/react';

// Standard styling for all Sirch inputs
const SIRCH_INPUT_STYLES = {
  variant: "bordered" as const,
  size: "lg" as const,
  radius: "none" as const,
  classNames: {
    input: "bg-black text-white",
    inputWrapper: "bg-black border-white data-[invalid=true]:border-red-500"
  }
};

// Standard styling for all Sirch checkboxes
const SIRCH_CHECKBOX_STYLES = {
  size: "lg" as const
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
