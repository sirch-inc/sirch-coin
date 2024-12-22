import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import supabase from '../App/supabaseProvider'


// TODO: handle errors here (esp 400-class, like "expired link", etc...)
export default function Welcome() {
  const location = useLocation();
  const verificationError = location.hash.includes('error=access_denied');
  const [resendEmail, setResendEmail] = useState('');
  const [resendEmailStatus, setResendEmailStatus] = useState('');
  const { session, userInTable } = useContext(AuthContext);

  const navigate = useNavigate();

    // To test this flow: use an expired verification link (expires in 24 hours)
  const resendVerificationEmail = async () => {
    if (!resendEmail) {
      setResendEmailStatus('You must enter a valid email.');
      return;
    }

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
        setResendEmailStatus('Failed to resend a verification email. Please try again, or if you already verified, please log in.');
        return;
      }

      setResendEmailStatus('Verification email sent! Please check you inbox for a confirmation link.');
    } catch(exception) {
      console.error("An exception occurred:", exception.message);

      navigate('/error', { replace: true });
    }
  }

  return (
    <>
      {
        session ? (
          userInTable ? (
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
            <h1> Verifying account... </h1>
          )
        ) : (
          <>
            {
              verificationError ? (
                <>
                  <h1>There was a problem verifying your account.</h1>
                  <p>
                    Your invite link is either invalid or has expired. If you&apos;ve already verified your account,
                    please try <a href='/login'>logging in</a>. Alternatively, you can request a new verification link below:
                  </p>

                  <form onSubmit={resendVerificationEmail}>
                    <input
                      className="account-input"
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter the email you used to create your account"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      required
                    >
                    </input>
                    <button className="big-btn" type='submit'> Resend Verification Email → </button>
                    {resendEmailStatus && <p>{resendEmailStatus}</p>}
                  </form>
                </>
              ) : (
                <>
                  <h3>You must be logged in to change your user account settings.</h3>
                </>
              )
            }
            
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Link to='/' className='big-btn'>
                Back to Home
              </Link>
            </div>
          </>
        )
      }
    </>
  );
}