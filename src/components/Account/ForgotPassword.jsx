import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../App/supabaseProvider';


export default function ForgotPassword() {
  const [userEmail, setUserEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState(null);
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
      <h1>Reset Password</h1>
      {/* TODO: Does this boolean switch even apply anymore since we now redirect on success of the request? */}
      {!resetSent ? (
      <>
        <p>Enter the email you used to sign up for Sirch Coin:</p>
        <form className='reset-password' onSubmit={requestReset}>
          <input
            type='email'
            placeholder="Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
            autoComplete='username'
          />
          <button type='submit'>Send Reset Email</button>
        </form>
        {error && <p className='error'>{error}</p>}
      </>
      ) : (
      <p>We&apos;ve emailed {userEmail} a link to reset your password. Please check your email inbox.</p>
      )}

      <div className='bottom-btn-container'>
        <button className='big-btn'
          onClick={() => { navigate(-1); }}>
          Back
        </button>
      </div>
    </>
  );
}