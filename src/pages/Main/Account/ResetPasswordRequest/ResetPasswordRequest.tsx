import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../_common/AuthContext';
import { ToastNotification, toast } from '../../_common/ToastNotification';
import supabase from '../../_common/supabaseProvider';
import { isAuthApiError, AuthError } from '@supabase/supabase-js';
import { Button } from '@heroui/react';
import { SirchEmailInput } from '../../../../components/HeroUIFormComponents';
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

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    if (!email || email.trim() === '') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const submitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(userEmail)) {
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
                onChange={(e) => setUserEmail(e.target.value)}
                isRequired
                autoComplete="email"
              />

              <div className='bottom-btn-container'>
                <Button 
                  type='submit' 
                  className='big-btn'
                  isLoading={sendStatus === "Sending..."}
                  isDisabled={!isValidEmail(userEmail) || sendStatus === "Sending..."}
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