import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import supabase from '../App/supabaseProvider';


export default function ForgotPassword() {
  const [userEmail, setUserEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState(null);
  const { session } = useContext(AuthContext);
  const navigate = useNavigate();

  async function requestReset(e) {
    e.preventDefault();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        userEmail,
        { redirectTo: `${window.location.origin}/reset-password` }
      );

      if (error) {
        throw error;
      } else {
        setResetSent(true);
      }
    } catch (exception) {
      // TODO: surface or handle error...
      console.error("An exception occurred:", exception.message);

      setError(exception.message);
    }
  }

  return (
    <>
      {
        !session ?
        (
          <>
            <h1>Reset Password</h1>
            {/* TODO: Does this boolean switch even apply anymore since we now redirect on success of the request? */}
            {!resetSent ? (
              <>
                <p>Enter the email address you used to sign up for Sirch Coin.</p>
                <p>We will send you a reset-password email containing a link to conduct that process.</p>
                <form className='reset-password' onSubmit={requestReset}>
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
                  <button className='account-button' type='submit'> Send Reset Email → </button>
                </form>

                {error &&
                  <p
                    style={{ color: 'red' }}
                    className='error'>
                    { error }
                  </p>}
              </>
            ) : (
              <>
                <p>We&apos;ve emailed {userEmail} a link to reset your password. Please check your email inbox.</p>
                <br/>
              </>
            )}
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

      <div className='bottom-btn-container'>
        <button className='big-btn'
          onClick={() => { navigate(-1); }}>
          Back
        </button>
      </div>
    </>
  );
}