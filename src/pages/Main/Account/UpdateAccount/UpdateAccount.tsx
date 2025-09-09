/**
 * UpdateAccount Component
 * 
 * Enhanced version with the following improvements:
 * 
 * 1. **Form Validation**: Real-time validation with error messages for:
 *    - Email format validation
 *    - Required field validation (first name, last name, user handle)
 *    - Name length validation (1-50 characters)
 * 
 * 2. **Better State Management**: 
 *    - Consolidated form data into a single state object
 *    - Optimized with useCallback for performance
 *    - Proper error state management
 * 
 * 3. **Enhanced UX**: 
 *    - Loading states for form submission and handle generation
 *    - Disabled buttons during async operations
 *    - Better error messaging and user feedback
 *    - Visual indicators for email change requirements
 * 
 * 4. **Accessibility**: 
 *    - Proper ARIA labels and error messages
 *    - Focus management
 *    - Screen reader friendly
 * 
 * 5. **Performance**: 
 *    - useCallback hooks to prevent unnecessary re-renders
 *    - Optimized validation functions
 * 
 * 6. **Code Organization**: 
 *    - Separated utility functions
 *    - Clear type definitions
 *    - Better error handling patterns
 */

import { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../_common/AuthContext';
import { ToastNotification, toast } from '../../_common/ToastNotification';
import supabase from '../../_common/supabaseProvider';
import { isAuthApiError } from '@supabase/supabase-js';
import { Button, Card, CardBody } from '@heroui/react';
import { SirchValidatedEmailInput, SirchTextInput, SirchPrivacyChip } from '../../../../components/HeroUIFormComponents';
import { useFormValidation, useAsyncOperation } from '../../../../hooks';
import { validators } from '../../../../utils';
import './UpdateAccount.css';

// Form data types
interface ValidationErrors extends Record<string, boolean> {
  email: boolean;
  firstName: boolean;
  lastName: boolean;
  userHandle: boolean;
}

interface FormData extends Record<string, unknown> {
  email: string;
  firstName: string;
  lastName: string;
  userHandle: string;
  isEmailPrivate: boolean;
  isNamePrivate: boolean;
}


export default function UpdateAccount() {
  const auth = useContext(AuthContext);
  const userInTable = auth?.userInTable;
  const userEmail = auth?.userEmail;
  const session = auth?.session;
  const navigate = useNavigate();

  // Initialize form with validation
  const initialFormData: FormData = {
    email: userEmail || '',
    firstName: userInTable?.first_name || '',
    lastName: userInTable?.last_name || '',
    userHandle: userInTable?.user_handle || '',
    isEmailPrivate: userInTable?.is_email_private ?? false,
    isNamePrivate: userInTable?.is_name_private ?? false,
  };

  // Validation rules using shared utilities
  const validationRules = {
    email: (value: unknown) => validators.email(value as string),
    firstName: (value: unknown) => validators.name(value as string, "First name"),
    lastName: (value: unknown) => validators.name(value as string, "Last name"),
    userHandle: (value: unknown) => validators.required(value as string, "User handle"),
    isEmailPrivate: () => ({ isValid: true }), // Privacy fields don't need validation
    isNamePrivate: () => ({ isValid: true })
  };

  // Use form validation hook
  const {
    formData,
    errors,
    validateForm,
    handleInputChange,
    updateInitialData,
    getFieldError
  } = useFormValidation<FormData, ValidationErrors>({
    initialData: initialFormData,
    validationRules
  });

  // Use async operation hooks
  const submitOperation = useAsyncOperation();
  const handleGenerationOperation = useAsyncOperation();

  // Additional state
  const [hasEmailChanged, setHasEmailChanged] = useState<boolean>(false);

  // Update form state when auth data becomes available
  useEffect(() => {
    if (userInTable || userEmail) {
      const newData: Partial<FormData> = {};
      
      if (userInTable) {
        newData.firstName = userInTable.first_name || '';
        newData.lastName = userInTable.last_name || '';
        newData.isNamePrivate = userInTable.is_name_private ?? false;
        newData.userHandle = userInTable.user_handle || '';
        newData.isEmailPrivate = userInTable.is_email_private ?? false;
      }
      
      if (userEmail) {
        newData.email = userEmail;
      }
      
      updateInitialData(newData);
    }
  }, [userInTable, userEmail, updateInitialData]);

  // Enhanced input change handler with email change detection
  const handleFormInputChange = useCallback((field: keyof FormData, value: string | boolean): void => {
    handleInputChange(field, value);

    // Handle email change detection
    if (field === 'email' && typeof value === 'string') {
      setHasEmailChanged(value !== userEmail);
    }
  }, [handleInputChange, userEmail]);

  const handleUpdate = useCallback(async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below and try again.");
      return;
    }

    await submitOperation.execute(
      async () => {
        const { error } = await supabase.auth.updateUser({
          email: formData.email,
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
            first_name: formData.firstName,
            last_name: formData.lastName,
            is_name_private: formData.isNamePrivate,
            user_handle: formData.userHandle,
            is_email_private: formData.isEmailPrivate
          }
        });

        if (error) {
          if (isAuthApiError(error) || error.code === 'weak_password') {
            throw new Error(error.message);
          }
          throw error;
        }

        if (hasEmailChanged) {
          toast.success("A verification email was sent to your new email address.");
        }
      },
      {
        successMessage: "Account updated successfully!",
        onError: (error) => console.error("Account update failed:", error)
      }
    );
  }, [formData, hasEmailChanged, validateForm, submitOperation]);

  const handleSuggestNewHandle = useCallback(async (): Promise<void> => {
    // Clear current handle to show loading state
    handleInputChange('userHandle', '');

    await handleGenerationOperation.execute(
      async () => {
        const { data, error } = await supabase.functions.invoke('generate-valid-user-handles', {
          body: { handleCount: 1 }
        });
      
        if (error) {
          throw error;
        }

        if (!data || !data.handles || data.handles.length === 0) {
          throw new Error("No available user handles found.");
        }

        handleInputChange('userHandle', data.handles[0]);
        return data.handles[0];
      },
      {
        onError: (error) => console.error("Handle generation failed:", error)
      }
    );
  }, [handleGenerationOperation, handleInputChange]);
  
  return (
    <div>
      <ToastNotification />

      {session ? (
        <>
          <h2 className="text-2xl font-bold text-center mb-8">Update Account</h2>

          <form onSubmit={handleUpdate} autoComplete="off" noValidate>
            <p>Update your account information below. Privacy settings control whether others can find you socially.</p>
            
            <div className="flex items-center gap-4">
              <SirchValidatedEmailInput
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleFormInputChange('email', e.target.value)}
                isRequired
                className="flex-1"
              />
              <SirchPrivacyChip
                isPrivate={formData.isEmailPrivate}
                onPrivacyChange={(value) => handleFormInputChange('isEmailPrivate', value)}
              />
            </div>

            {hasEmailChanged && (
              <Card className="bg-success-50 border-success-200 success-notification">
                <CardBody>
                  <p className="text-success-600 text-sm">
                    Note: Changes to your email address will require email reverification.
                  </p>
                </CardBody>
              </Card>
            )}

            <div className="flex items-center gap-4">
              <div className="flex gap-4 flex-1">
                <SirchTextInput
                  label="First Name"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => handleFormInputChange('firstName', e.target.value)}
                  isRequired
                  isInvalid={errors.firstName}
                  errorMessage={getFieldError('firstName')}
                  maxLength={50}
                />
                <SirchTextInput
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => handleFormInputChange('lastName', e.target.value)}
                  isRequired
                  isInvalid={errors.lastName}
                  errorMessage={getFieldError('lastName')}
                  maxLength={50}
                />
              </div>
              <SirchPrivacyChip
                isPrivate={formData.isNamePrivate}
                onPrivacyChange={(value) => handleFormInputChange('isNamePrivate', value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <SirchTextInput
                label="Sirch User Phrase"
                value={formData.userHandle}
                placeholder={handleGenerationOperation.isLoading ? "Generating..." : "Loading..."}
                isReadOnly
                isRequired
                isInvalid={errors.userHandle}
                errorMessage={getFieldError('userHandle')}
                className="flex-1"
                classNames={{
                  input: "font-mono text-lg bg-default-50 !text-white"
                }}
                endContent={
                  <Button
                    size="md"
                    variant="solid"
                    onPress={handleSuggestNewHandle}
                    isDisabled={!formData.userHandle || handleGenerationOperation.isLoading}
                    isLoading={handleGenerationOperation.isLoading}
                    className="min-w-fit px-3 bg-default-800 text-white hover:bg-default-700"
                    title="Pick Another Phrase"
                  >
                    {handleGenerationOperation.isLoading ? "..." : "↺"}
                  </Button>
                }
              />
              <SirchPrivacyChip
                isPrivate={false}
                onPrivacyChange={() => {}}
                isDisabled
              />
            </div>

            <div className='bottom-btn-container'>
              <Button
                type="submit"
                className='big-btn'
                isLoading={submitOperation.isLoading}
                isDisabled={submitOperation.isLoading}
              >
                {submitOperation.isLoading ? "Updating..." : "Update →"}
              </Button>

              <Button 
                className='big-btn' 
                onPress={() => { navigate(-1); }}
                isDisabled={submitOperation.isLoading}
              >
                Back
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">You must be logged in to change your user account settings.</h3>
        </div>
      )}
    </div>
  );
}