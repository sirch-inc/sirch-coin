import { useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../_common/AuthContext';
import { ToastNotification, toast } from '../../_common/ToastNotification';
import supabase from '../../_common/supabaseProvider';
import { isAuthApiError } from '@supabase/supabase-js';
import { Button } from '@heroui/react';
import { SirchValidatedEmailInput, SirchPasswordInput } from '../../../../components/HeroUIFormComponents';
import { useFormValidation, useAsyncOperation } from '../../../../hooks';
import { validators } from '../../../../utils';
import './Login.css';

// Form data types
interface ValidationErrors extends Record<string, boolean> {
  email: boolean;
  password: boolean;
}

interface LoginFormData extends Record<string, unknown> {
  email: string;
  password: string;
}

export default function Login() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // Initialize form data
  const initialFormData: LoginFormData = {
    email: '',
    password: '',
  };

  // Validation rules using shared utilities
  const validationRules = {
    email: (value: unknown) => validators.email(value as string),
    password: (value: unknown) => validators.required(value as string, "Password"),
  };

  // Use form validation hook
  const {
    formData,
    errors,
    validateForm,
    handleInputChange,
    getFieldError
  } = useFormValidation<LoginFormData, ValidationErrors>({
    initialData: initialFormData,
    validationRules
  });

  // Use async operation hook
  const loginOperation = useAsyncOperation();

  // Enhanced input change handler
  const handleFormInputChange = useCallback((field: keyof LoginFormData, value: string): void => {
    handleInputChange(field, value);
  }, [handleInputChange]);
  
  const handleLogin = useCallback(async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below and try again.");
      return;
    }

    await loginOperation.execute(
      async () => {
        const { data: user, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) {
          if (isAuthApiError(error)) {
            // Clear password on authentication error for security
            handleInputChange('password', '');
            throw new Error(error.message);
          }
          throw error;
        }

        if (!user) {
          throw new Error("No user was returned.");
        }

        navigate('/');
      },
      {
        successMessage: "Welcome back! You have been logged in successfully.",
        onError: (error) => console.error("Login failed:", error)
      }
    );
  }, [formData, validateForm, loginOperation, handleInputChange, navigate]);
  
  return (
    <div className="login-container">
      <ToastNotification />

      {!auth?.session ? (
        <>
          <h2 className="text-2xl font-bold text-center mb-8">Log in to Sirch Coins</h2>
          <p>New users should <a href="/create-account">create a Sirch Coins account</a>.</p>
          
          <form className="login-form" onSubmit={handleLogin} autoComplete="off" noValidate>
            
            <SirchValidatedEmailInput
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleFormInputChange('email', e.target.value)}
              isRequired
            />

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
            />

            <div className='bottom-btn-container'>
              <Button
                type="submit"
                className='big-btn'
                isLoading={loginOperation.isLoading}
                isDisabled={loginOperation.isLoading}
              >
                {loginOperation.isLoading ? "Logging In..." : "Log In →"}
              </Button>
            </div>
            
            <a className="reset-password-link" href='/reset-password-request'>Forgot your password?</a>
          </form>
        </>
      ) : (
        <>
          <h2>You are currently logged in.</h2>
          <br/>
          <h3>Please Log Out first if you want to Login with a different account.</h3>
        </>
      )}

      <div className='bottom-btn-container'>
        <Button
          className='big-btn'
          onPress={() => { navigate(-1); }}
          isDisabled={loginOperation.isLoading}
        >
          Back
        </Button>
      </div>
    </div>
  );
}