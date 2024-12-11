import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import supabase from '../App/supabaseProvider'


export default function ForgotPassword() {
  const [userEmail, setUserEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  async function requestReset(e) {
    e.preventDefault();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        userEmail,
        { redirectTo: `${window.location.origin}/reset-password` }
      );

      if (error) {
        throw new Error(error);
      }

      setResetSent(true);
    } catch (exception) {
      console.error(exception);

      navigate('/error', { replace: true });
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
      </>
      ) : (
      <p>If the email address {userEmail} has a Sirch Coins account, we&apos;ve emailed you a link to reset your password. Please check your email inbox.</p>
      )}
    </>
  );
}