import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { ToastNotification, toast } from '../App/ToastNotification';
import supabase from '../App/supabaseProvider'
import { isAuthApiError } from '@supabase/supabase-js';


const VerificationError = ({ userEmail, setUserEmail, resendVerificationEmail, emailSendStatus }) => (
  <>
    <h1>Verify Account</h1>

    <h2>There was a problem verifying your account.</h2>
    <p>
      Your verification link is invalid, has expired, or has already been used.
      <br/>
      If you&apos;ve already verified your account, please try <a href='/login'>logging in</a>.
      <br/>
      Alternatively, you can request a new verification link below.
    </p>
    <p>
      Enter the email address you used to sign up for Sirch Coin.
      <br/>
      We will resend a verification email containing a link to complete that process.
    </p>
    <form onSubmit={resendVerificationEmail}>
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
        Resend Verification Email →
      </button>
    </form>

    {emailSendStatus && <p>{emailSendStatus}</p>}
  </>
);

export default function Welcome() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, userInTable } = useContext(AuthContext);
  const verificationError = location.hash.includes('error=access_denied');
  const [userEmail, setUserEmail] = useState('');
  const [emailSendStatus, setEmailSendStatus] = useState('');


  // To test this flow: use an expired verification link (expires in 24 hours)
  const resendVerificationEmail = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setEmailSendStatus("Sending...");

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`
        }
      });

      if (error) {
        if (isAuthApiError(error)) {
          toast.error(error.message);
          return;
        }

        throw new Error(error);
      }

      // reset form
      setUserEmail('');
      setEmailSendStatus('');

      toast.success(`We've emailed ${userEmail} a link to verify your account! Please check your email inbox.`);
    } catch(exception) {
      console.error("An exception occurred:", exception.message);

      navigate('/error', { replace: true });
    }
  }

  return (
    <>
      <ToastNotification />

      {session && userInTable &&
        <>
          <h1>Welcome {userInTable?.first_name}!</h1>
          <p>Your Sirch Coins account has been verified and you may now use all of the Sirch Coin services.</p>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Link to='/' className='big-btn'>
              Get started!
            </Link>
          </div>
        </>
      }

      {verificationError &&
        <VerificationError
          userEmail={userEmail}
          setUserEmail={setUserEmail}
          resendVerificationEmail={resendVerificationEmail}
          emailSendStatus={emailSendStatus}
        />
      }
    </>
  );
}

// {emailSendStatus && <p>{emailSendStatus}</p>}
