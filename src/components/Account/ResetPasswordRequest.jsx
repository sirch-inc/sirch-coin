import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import supabase from '../App/supabaseProvider';
import { isAuthApiError } from '@supabase/supabase-js';


export default function ResetPasswordRequest(props) {
  const { isVerificationError = false } = props;

  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [inputError, setInputError] = useState(null);
  const { session } = useContext(AuthContext);


  async function submitRequest(e) {
    e.preventDefault();

    if (userEmail === '') {
      setInputError('Please enter an email address.');
      return;
    }

    try {
      // TODO: consider using supabase.auth.reauthenticate() to require the user to re-enter their password
      const { error } = await supabase.auth.resetPasswordForEmail(
        userEmail,
        { redirectTo: `${window.location.origin}/reset-password` }
      );

      if (error) {
        if (isAuthApiError(error)) {
          toast.error(error.message);
          return;
        }

        throw new Error(error);
      }

      setRequestSent(true);
    } catch (exception) {
      console.error("An exception occurred:", exception.message);

      navigate('/error', { replace: true });
    }
  }

  return (
    <>
      <ToastContainer
        position = 'top-right'
        autoClose = {false}
        newestOnTop = {false}
        closeOnClick
        draggable
        theme = 'colored'
      />

      {!isVerificationError &&
        <h1>Reset Password Request</h1>
      }

      {!session ?
        (
          <>
            {!requestSent ?
              (
                <>
                  <p>Enter the email address you used to sign up for Sirch Coin.<br/>We will send you a reset-password email containing a link to complete that process.</p>
                  <form className='reset-password' onSubmit={submitRequest}>
                    <input
                      className='account-input'
                      type='email'
                      id='email'
                      name='email'
                      placeholder="Email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      autoComplete='email'
                      required
                    />

                    {inputError &&
                      <p
                        style={{ color: 'red' }}
                        className='error'>
                        { inputError }
                      </p>
                    }

                    <button className='account-button' type='submit'>
                      {isVerificationError ? "Resend" : "Send"} Reset Password Email →
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <p>We&apos;ve emailed {userEmail} a link to reset your password. Please check your email inbox.</p>
                  <br/>
                </>
              )
            }
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

      {!isVerificationError &&
        <div className='bottom-btn-container'>
          <button className='big-btn'
            onClick={() => { navigate(-1); }}>
            Back
          </button>
        </div>
      }
    </>
  );
}

ResetPasswordRequest.propTypes = {
  isVerificationError: PropTypes.boolean
};
