import { useState, useCallback } from 'react';
import { ValidationResult } from '../utils/validation';

/**
 * Generic form validation hook that provides consistent form handling patterns
 */
export function useFormValidation<
  TFormData extends Record<string, unknown>,
  TErrors extends Record<keyof TFormData, boolean>
>({
  initialData,
  validationRules
}: {
  initialData: TFormData;
  validationRules: Record<keyof TFormData, (value: TFormData[keyof TFormData]) => ValidationResult>;
}) {
  const [formData, setFormData] = useState<TFormData>(initialData);
  const [errors, setErrors] = useState<TErrors>(() => {
    const initialErrors = {} as TErrors;
    Object.keys(initialData).forEach(key => {
      initialErrors[key as keyof TFormData] = false as TErrors[keyof TFormData];
    });
    return initialErrors;
  });

  const validateForm = useCallback((): boolean => {
    const newErrors = {} as TErrors;
    let isValid = true;

    for (const [field, validator] of Object.entries(validationRules)) {
      const result = validator(formData[field as keyof TFormData]);
      newErrors[field as keyof TFormData] = !result.isValid as TErrors[keyof TFormData];
      if (!result.isValid) {
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [formData, validationRules]);

  const validateField = useCallback((field: keyof TFormData): boolean => {
    const validator = validationRules[field];
    if (!validator) return true;

    const result = validator(formData[field]);
    setErrors(prev => ({
      ...prev,
      [field]: !result.isValid as TErrors[keyof TFormData]
    }));

    return result.isValid;
  }, [formData, validationRules]);

  const handleInputChange = useCallback((field: keyof TFormData, value: TFormData[keyof TFormData]): void => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [field]: false as TErrors[keyof TFormData]
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    const clearedErrors = {} as TErrors;
    Object.keys(initialData).forEach(key => {
      clearedErrors[key as keyof TFormData] = false as TErrors[keyof TFormData];
    });
    setErrors(clearedErrors);
  }, [initialData]);

  const updateInitialData = useCallback((newData: Partial<TFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  }, []);

  const getFieldError = useCallback((field: keyof TFormData): string => {
    if (!errors[field]) return '';
    
    const validator = validationRules[field];
    if (!validator) return '';
    
    const result = validator(formData[field]);
    return result.message || 'Invalid value';
  }, [errors, formData, validationRules]);

  return {
    formData,
    errors,
    validateForm,
    validateField,
    handleInputChange,
    resetForm,
    updateInitialData,
    getFieldError
  };
}
