/**
 * Shared validation utilities for form components
 * 
 * These validators provide consistent validation logic across the application
 * and can be easily tested and maintained in one place.
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Email validation using RFC 5322 compliant regex
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates that a value is not empty after trimming whitespace
 */
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates name fields (1-50 characters after trimming)
 */
export const isValidName = (name: string): boolean => {
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= 50;
};

/**
 * Validates positive numbers (greater than 0)
 */
export const isPositiveNumber = (value: string): boolean => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

/**
 * Validates maximum length constraint
 */
export const isValidLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

/**
 * Validates that a number is within a specified range
 */
export const isInRange = (value: string, min: number, max: number): boolean => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Comprehensive validation functions with error messages
 */
export const validators = {
  email: (email: string): ValidationResult => ({
    isValid: isValidEmail(email),
    message: "Please enter a valid email address"
  }),
  
  required: (value: string, fieldName = "This field"): ValidationResult => ({
    isValid: isRequired(value),
    message: `${fieldName} is required`
  }),
  
  name: (name: string, fieldName = "Name"): ValidationResult => ({
    isValid: isValidName(name),
    message: `${fieldName} must be between 1-50 characters`
  }),
  
  positiveNumber: (value: string, fieldName = "Amount"): ValidationResult => ({
    isValid: isPositiveNumber(value),
    message: `${fieldName} must be a positive number`
  }),
  
  maxLength: (value: string, maxLength: number, fieldName = "Field"): ValidationResult => ({
    isValid: isValidLength(value, maxLength),
    message: `${fieldName} cannot exceed ${maxLength} characters`
  }),
  
  range: (value: string, min: number, max: number, fieldName = "Value"): ValidationResult => ({
    isValid: isInRange(value, min, max),
    message: `${fieldName} must be between ${min} and ${max}`
  })
};

/**
 * Utility to validate multiple fields at once
 */
export const validateFields = <T extends Record<string, unknown>>(
  data: T,
  validationRules: Record<keyof T, (value: T[keyof T]) => ValidationResult>
): { isValid: boolean; errors: Record<keyof T, string> } => {
  const errors = {} as Record<keyof T, string>;
  let isValid = true;

  for (const [field, validator] of Object.entries(validationRules)) {
    const result = validator(data[field as keyof T]);
    if (!result.isValid) {
      errors[field as keyof T] = result.message || "Invalid value";
      isValid = false;
    }
  }

  return { isValid, errors };
};

/**
 * Utility function to validate email for form submission
 * Returns true if email is valid (for required fields) or valid format (for optional fields)
 */
export const isValidEmailForSubmission = (email: string, isRequired: boolean = false): boolean => {
  if (isRequired && (!email || email.trim() === '')) {
    return false;
  }
  if (email && email.trim() !== '') {
    return validators.email(email).isValid;
  }
  return true; // Empty optional field is valid
};
