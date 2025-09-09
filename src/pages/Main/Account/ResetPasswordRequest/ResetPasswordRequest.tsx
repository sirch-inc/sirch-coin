import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../_common/AuthContext';
import { ToastNotification, toast } from '../../_common/ToastNotification';
import supabase from '../../_common/supabaseProvider';
import { isAuthApiError, AuthError } from '@supabase/supabase-js';
import { Button } from '@heroui/react';
import { SirchEmailInput } from '../../../../components/HeroUIFormComponents';
import { validators } from '../../../../utils';
import './ResetPasswordRequest.css';

interface ResetPasswordRequestProps {
  standalone?: boolean;
}

export default function ResetPasswordRequest({ standalone = true }: ResetPasswordRequestProps) {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const session = authContext?.session;
  const [userEmail, setUserEmail] = useState<string>('');
  const [sendStatus, setSendStatus] = useState<string>('');
  const [emailBlurred, setEmailBlurred] = useState<boolean>(false);

  // Email validation using shared utility
  const emailValidation = validators.email(userEmail);
  const isEmailValid = emailValidation.isValid;
  const emailError = emailBlurred && !isEmailValid && userEmail.trim() !== '' ? emailValidation.message : undefined;

  const submitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isEmailValid) {
      toast.error("Please enter a valid email address.");
      setSendStatus(''); // Reset status when validation fails
      return;
    }

    setSendStatus("Sending...");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        userEmail,
        { redirectTo: `${window.location.origin}/reset-password` }
      );

      if (error) {
        if (isAuthApiError(error) || error.code === 'weak_password') {
          toast.error(error.message);
          setSendStatus(''); // Reset status when API error occurs
          return;
        }

        throw error;
      }

      // reset form
      setUserEmail('');
      setSendStatus('');
      setEmailBlurred(false); // Reset validation state

      toast.success(`We've emailed ${userEmail} a link to reset your password! Please check your email inbox.`);
    } catch (exception) {
      if (exception instanceof AuthError || exception instanceof Error) {
        console.error("An exception occurred:", exception.message);
      }

      navigate('/error', { replace: true });
    }
  }

  return (
    <>
      <ToastNotification />

      <div>
        {standalone &&
          <h2>Reset Password Request</h2>
        }

        {!session ? (
          <>
            <form onSubmit={submitRequest} autoComplete='off' noValidate>
              <p>Enter the email address you used to sign up for Sirch Coins.</p>
              <p>We will send you a reset-password email containing a link to complete that process.</p>
            
              <SirchEmailInput
                label="Email Address"
                placeholder="Your Sirch Coins account email address"
                value={userEmail}
                onChange={(e) => {
                  setUserEmail(e.target.value);
                  if (emailBlurred) {
                    setEmailBlurred(false); // Reset blur state when user starts typing again
                  }
                }}
                onBlur={() => setEmailBlurred(true)}
                isRequired
                autoComplete="email"
                isInvalid={!!emailError}
                errorMessage={emailError}
              />

              <div className='bottom-btn-container'>
                <Button 
                  type='submit' 
                  className='big-btn'
                  isLoading={sendStatus === "Sending..."}
                  isDisabled={!isEmailValid || sendStatus === "Sending..."}
                >
                  {sendStatus === "Sending..." ? "Sending..." : `${standalone ? "Send" : "Resend"} Reset Password Email →`}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2>You are currently logged in.</h2>
            <br/>
            <h3>You can update your account password under My Account.</h3>
            <br/>
          </>
        )
      }

      {standalone &&
        <div className='bottom-btn-container'>
          <Button 
            className='big-btn'
            onPress={() => { navigate(-1); }}
            isDisabled={sendStatus === "Sending..."}
          >
            Back
          </Button>
        </div>
      }
      </div>
    </>
  );
}