import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../_common/AuthContext';
import { ToastNotification, toast } from '../../_common/ToastNotification';
import supabase from '../../_common/supabaseProvider';
import { isAuthApiError, AuthError } from '@supabase/supabase-js';
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

  const submitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userEmail === '') {
      toast.error("Please enter a valid email address.");
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
    <div className="reset-password-container">
      <ToastNotification />

      {standalone &&
        <h1>Reset Password Request</h1>
      }

      {!session ?
        (
          <>
            <p>
              Enter the email address you used to sign up for Sirch Coins.
              <br/>
              We will send you a reset-password email containing a link to complete that process.
            </p>

            <form className='reset-password-form' onSubmit={submitRequest}>
              <input
                className='account-input'
                id='email'
                name='email'
                type='email'
                placeholder="Your Sirch Coins account email address"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                autoComplete='email'
                required
              />

              <button className='account-button' type='submit'>
                {standalone ? "Send" : "Resend"} Reset Password Email →
              </button>

              {sendStatus && <p>{sendStatus}</p>}
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
          <button className='big-btn'
            onClick={() => { navigate(-1); }}>
            Back
          </button>
        </div>
      }
    </div>
  );
}