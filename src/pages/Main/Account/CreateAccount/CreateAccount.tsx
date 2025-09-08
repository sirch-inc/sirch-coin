import { useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastNotification, toast } from '../../_common/ToastNotification';
import { AuthContext } from '../../_common/AuthContext';
import supabase from '../../_common/supabaseProvider';
import { isAuthApiError } from '@supabase/supabase-js';
import { Button, Card, CardBody } from '@heroui/react';
import { SirchEmailInput, SirchTextInput, SirchPasswordInput, SirchPrivacyChip } from '../../../../components/HeroUIFormComponents';
import { useFormValidation, useAsyncOperation } from '../../../../hooks';
import { validators } from '../../../../utils';
import './CreateAccount.css';

// Form data types
interface ValidationErrors extends Record<string, boolean> {
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
  firstName: boolean;
  lastName: boolean;
  userHandle: boolean;
}

interface CreateAccountFormData extends Record<string, unknown> {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  userHandle: string;
  isEmailPrivate: boolean;
  isNamePrivate: boolean;
}

export default function CreateAccount() {
  const authContext = useContext(AuthContext);
  const session = authContext?.session;
  const navigate = useNavigate();

  // Initialize form data
  const initialFormData: CreateAccountFormData = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    userHandle: '',
    isEmailPrivate: false,
    isNamePrivate: false,
  };

  // Validation rules using shared utilities
  const validationRules = {
    email: (value: unknown) => validators.email(value as string),
    password: (value: unknown) => {
      const password = value as string;
      if (!password || password.length < 6) {
        return { isValid: false, message: "Password must be at least 6 characters" };
      }
      if (password.length > 64) {
        return { isValid: false, message: "Password must be 64 characters or less" };
      }
      return { isValid: true };
    },
    confirmPassword: (value: unknown) => {
      const confirmPassword = value as string;
      if (confirmPassword !== formData.password) {
        return { isValid: false, message: "Passwords do not match" };
      }
      return { isValid: true };
    },
    firstName: (value: unknown) => validators.name(value as string, "First name"),
    lastName: (value: unknown) => validators.name(value as string, "Last name"),
    userHandle: (value: unknown) => validators.required(value as string, "User handle"),
    isEmailPrivate: () => ({ isValid: true }),
    isNamePrivate: () => ({ isValid: true })
  };

  // Use form validation hook
  const {
    formData,
    errors,
    validateForm,
    handleInputChange,
    getFieldError
  } = useFormValidation<CreateAccountFormData, ValidationErrors>({
    initialData: initialFormData,
    validationRules
  });

  // Use async operation hooks
  const submitOperation = useAsyncOperation();
  const handleGenerationOperation = useAsyncOperation();

  // Enhanced input change handler with real-time password matching
  const handleFormInputChange = useCallback((field: keyof CreateAccountFormData, value: string | boolean): void => {
    handleInputChange(field, value);
  }, [handleInputChange]);

  // roll new user handle
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

  // Generate initial handle only once on component mount
  useEffect(() => {
    handleSuggestNewHandle();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignUp = useCallback(async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below and try again.");
      return;
    }

    await submitOperation.execute(
      async () => {
        const { data: user, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/welcome`,
            data: {
              full_name: `${formData.firstName} ${formData.lastName}`,
              first_name: formData.firstName,
              last_name: formData.lastName,
              is_name_private: formData.isNamePrivate,
              user_handle: formData.userHandle,
              is_email_private: formData.isEmailPrivate
            },
          },
        });

        if (error) {
          if (isAuthApiError(error) || error.code === 'weak_password') {
            throw new Error(error.message);
          }
          throw error;
        }

        if (!user) {
          throw new Error("No user was returned.");
        }

        navigate('/verify-account');
      },
      {
        successMessage: "Account created successfully! Please check your email to verify your account.",
        onError: (error) => console.error("Account creation failed:", error)
      }
    );
  }, [formData, validateForm, submitOperation, navigate]);

  // Helper to check if passwords match for UI feedback
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  
  return (
    <>
      <ToastNotification />

      {!session ?
        (
          <>
            <h2>Create Account</h2>
            <p>Already have an account? <a href='/login'>Log in</a> instead.</p>
            <br></br>

            <div className='account-privacy-statement'>
              <h3>Your Account & Privacy</h3>
              <p>
                Sirch and the Sirch Coins product and services take your privacy very seriously.
                We believe your data (email address, name, photo, activity, and social connections) belong to <i>you</i>, and
                that <i>you</i> should decide how and when to share them or make them accessible to others.
              </p>
              <p>
                That said, we also encourage our users to share their profile with others to create a networked community
                and to make it easier for people on our platforms to find and connect with you.
              </p>
              <p>
                The choice is yours; you can adjust your Privacy settings at any time in your Account Profile.
              </p>
            </div>

            <br></br>

            <form onSubmit={handleSignUp} autoComplete='off' noValidate>
              <p>Create your new Sirch account below. Privacy settings control whether others can find you socially.</p>
              
              <div className="flex items-center gap-4">
                <SirchEmailInput
                  label="Email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleFormInputChange('email', e.target.value)}
                  isRequired
                  isInvalid={errors.email}
                  errorMessage={getFieldError('email')}
                  className="flex-1"
                />
                <SirchPrivacyChip
                  isPrivate={formData.isEmailPrivate}
                  onPrivacyChange={(value) => handleFormInputChange('isEmailPrivate', value)}
                />
              </div>

              <div className="flex gap-4">
                <SirchPasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleFormInputChange('password', e.target.value)}
                  isRequired
                  isInvalid={errors.password}
                  errorMessage={getFieldError('password')}
                  minLength={6}
                  maxLength={64}
                  className="flex-1"
                />
                <SirchPasswordInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleFormInputChange('confirmPassword', e.target.value)}
                  isRequired
                  isInvalid={errors.confirmPassword}
                  errorMessage={getFieldError('confirmPassword')}
                  minLength={6}
                  maxLength={64}
                  className="flex-1"
                />
              </div>

              {formData.confirmPassword && (
                <Card className={passwordsMatch ? "bg-success-50 border-success-200" : "bg-danger-50 border-danger-200"}>
                  <CardBody>
                    <p className={passwordsMatch ? "text-success-600 text-sm" : "text-danger-600 text-sm"}>
                      {passwordsMatch ? "Passwords match!" : "Passwords do not match"}
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

              <div className="account-row">
                <div style={{ width: '30%' }}>
                  <p>
                  Your Sirch account includes a unique, random, two-word phrase to help other users find you
                  easily and to help keep your Name and Email private if you choose not to share them.
                  </p>
                  <p>
                  You may change this phrase at any time in your User Account Profile.
                  </p>
                </div>
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
                      {handleGenerationOperation.isLoading ? "..." : "Pick Another ↺"}
                    </Button>
                  }
                />
              </div>

              <div className='bottom-btn-container'>
                <Button
                  type="submit"
                  className='big-btn'
                  isLoading={submitOperation.isLoading}
                  isDisabled={submitOperation.isLoading}
                >
                  {submitOperation.isLoading ? "Creating Account..." : "Sign Up →"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2>You are currently logged in.</h2>
            <br/>
            <h3>Please Log Out first if you want to create another account.</h3>
            <br/>
          </>
        )}

      <div className='bottom-btn-container'>
        <Button 
          className='big-btn'
          onPress={() => { navigate(-1); }}
          isDisabled={submitOperation.isLoading}
        >
          Back
        </Button>
      </div>
    </>
  );
}