import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../_common/AuthContext';
import { ToastNotification, toast } from '../../_common/ToastNotification';
import AccountVerificationError from '../AccountVerificationError/AccountVerificationError';
import supabase from '../../_common/supabaseProvider';
import { isAuthApiError } from '@supabase/supabase-js';
import { Button } from '@heroui/react';
import './Welcome.css';


export default function Welcome() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const session = auth?.session;
  const userInTable = auth?.userInTable;
  const verificationError = location.hash.includes('error=access_denied');
  const [userEmail, setUserEmail] = useState('');
  const [emailSendStatus, setEmailSendStatus] = useState('');


  // NOTE: To test this flow: use an expired verification link (expires in 24 hours)
  const resendVerificationEmail = async (e: React.FormEvent<HTMLFormElement>) => {
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

        throw new Error(error.message || 'An unknown error occurred');
      }

      // reset form
      setUserEmail('');
      setEmailSendStatus('');

      toast.success(`We've emailed ${userEmail} a link to verify your account! Please check your email inbox.`);
    } catch(exception) {
      console.error("An exception occurred:", exception);

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
              <Button 
                as={Link} 
                to='/' 
                className='big-btn'
              >
                Back to Home
              </Button>
            </div>
          </>
        ) : 
        (
          verificationError ? 
          (
            <AccountVerificationError
              userEmail={userEmail}
              setUserEmail={setUserEmail}
              resendVerificationEmail={resendVerificationEmail}
              emailSendStatus={emailSendStatus}
            />
          ) : 
          (
            <>
              <h1>Welcome!</h1>
              <p>
                Thank you for creating your account. 
                <br/>
                Please check your email inbox for a verification link. You will need to click that link to verify your account.
              </p>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Button 
                  as={Link} 
                  to='/' 
                  className='big-btn'
                >
                  Back to Home
                </Button>
              </div>
            </>
          )
        )
      }
    </>
  );
}