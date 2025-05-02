import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import { ToastNotification, toast } from '../../_common/ToastNotification';
import AccountVerificationError from '../AccountVerificationError/AccountVerificationError';
import supabase from '../../_common/supabaseProvider';
import { isAuthApiError } from '@supabase/supabase-js';
import './Welcome.css';


export default function Welcome() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, userInTable } = useContext(AuthContext);
  const verificationError = location.hash.includes('error=access_denied');
  const [userEmail, setUserEmail] = useState('');
  const [emailSendStatus, setEmailSendStatus] = useState('');


  // NOTE: To test this flow: use an expired verification link (expires in 24 hours)
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
          setEmailSendStatus('');
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

      // reset form
      setUserEmail('');
      setEmailSendStatus('');

      navigate('/error', { replace: true });
    }
  }

  return (
    <>
      <ToastNotification />

      {session && userInTable ?
        (
          <>
            <h1>Welcome {userInTable?.first_name}!</h1>
            <p>Your Sirch Coins account has been verified and you may now use all of the Sirch Coin services.</p>
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Link to='/' className='big-btn'>
                Get started!
              </Link>
            </div>
          </>
        ) : (
          <h1>Verifying account...</h1>
        )
      }

      {verificationError &&
        <AccountVerificationError
          userEmail={userEmail}
          setUserEmail={setUserEmail}
          resendVerificationEmail={resendVerificationEmail}
          emailSendStatus={emailSendStatus}
        />
      }
    </>
  );
}