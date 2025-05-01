import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../pages/Main/AuthContext';
import PropTypes from 'prop-types';
import { ToastNotification, toast } from '../../../pages/Main/App/ToastNotification';
import supabase from '../../../pages/Main/App/supabaseProvider';
import { isAuthApiError } from '@supabase/supabase-js';
import './ResetPasswordRequest.css';

export default function ResetPasswordRequest(props) {
  const { standalone = true } = props;
  const navigate = useNavigate();
  const { session } = useContext(AuthContext);
  const [userEmail, setUserEmail] = useState('');
  const [sendStatus, setSendStatus] = useState('');

  const submitRequest = async (e) => {
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

        throw new Error(error);
      }

      // reset form
      setUserEmail('');
      setSendStatus('');

      toast.success(`We've emailed ${userEmail} a link to reset your password! Please check your email inbox.`);
    } catch (exception) {
      console.error("An exception occurred:", exception.message);

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

ResetPasswordRequest.propTypes = {
  standalone: PropTypes.bool
};