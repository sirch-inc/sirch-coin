import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { useState, useContext } from 'react';
import supabase from '../App/supabaseProvider'


// TODO: handle errors here (esp 400-class, like "expired link", etc...)
export default function Welcome() {
  const { session, userInTable } = useContext(AuthContext);
  const [resendEmail, setResendEmail] = useState('');
  const [resendEmailStatus, setResendEmailStatus] = useState('');
  const location = useLocation();
  const verificationError = location.hash.includes('error=access_denied');

  // NOTE: To test this flow: use an expired verification link (expires in 24 hours)
  const resendVerificationEmail = async () => {
    if (resendEmail) {
      setResendEmailStatus('Sending...');

      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: resendEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/welcome`
          }
        });
  
        if (error) {
          setResendEmailStatus("Failed to resend a verification email. Please try again, or if you already verified, please log in.");
          return;
        } else {
          setResendEmailStatus("Verification email sent! Please check you inbox for a confirmation link.");
          return;
        }         
      } catch (exception) {
        console.error(exception);
  
        navigate('/error', { replace: true });
      }
        
    } else {
      setResendEmailStatus('We are having trouble processing your request. Please try again.')
    }
  }

  // TODO: change this to a single "return" using session and verification error as a ternary
  if (verificationError) {
    return (
      <div>
        <h1>There was a problem verifying your account.</h1>
        <p>Your invitation link is either invalid or has expired. If you&apos;ve already verified your account, please try <a href='/login'>logging in</a>. Alternatively, you can request a new verification link below:</p>
        <input
          placeholder="Enter the email you used to create your account"
          value={resendEmail}
          onChange={(e) => setResendEmail(e.target.value)}
        >
        </input>
        <button onClick={resendVerificationEmail}>Resend Verification Email</button>
        {resendEmailStatus && <p>{resendEmailStatus}</p>}
      </div>
    )
  } else {
    return(
        <>
          {session && userInTable
            ?
              <div>
                <h1>Welcome {userInTable?.first_name}!</h1>
                <h4>Your Sirch Coins account has been created and you may now use all of the Sirch Coin services!</h4>
                <div className='button-container'>
                  <Link to='/' className='action-btn'>
                    Get Started!
                  </Link>
                </div>
              </div>
            : <h1> Verifying... </h1>
          }
        </>
    )
  }
}