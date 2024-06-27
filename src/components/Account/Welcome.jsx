import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useState, useContext } from "react";
import supabase from "../../Config/supabaseConfig"


// TODO: handle errors here (esp 400-class, like "expired link", etc...)
export default function Welcome() {
  const { session, userInTable } = useContext(AuthContext);
  const location = useLocation();
  const [resendEmailStatus, setResendEmailStatus] = useState('');
  const verificationError = location.hash.includes('error=access_denied');
  const [usersEmail, setUsersEmail] = useState('');

  const handleEmailChange = (event) => {
    setUsersEmail(event.target.value);
  };

  //TODO: Test this flow with an expired verification link (to test -> request verification, wait 24 hours, click)
  const resendVerificationEmail = async () => {
    if (usersEmail) {
      setResendEmailStatus('Sending...');
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: usersEmail,
       });
       if (error) {
        setResendEmailStatus('Failed to resend a verification email. Please try again, or if you already verified, please log in.');
       } else {
        setResendEmailStatus('Verification email sent! Please check you inbox for a confirmation link.');
       }
    } else {
      setResendEmailStatus('We are having trouble processing your request. Please try again.')
    }
  }

  if (verificationError) {
    return (
      <div>
        <h1>There was a problem verifying your account.</h1>
        <p>Your invite link is either invalid, or has expired. If you&apos;ve already verified your account, please try <a href="/login">logging in</a>. Alternatively, you can request a new verification link below:</p>
        <input placeholder="Enter the email you used to create your account" value={usersEmail} onChange={handleEmailChange}>
        </input>
        <button onClick={resendVerificationEmail}>Resend Verification Email</button>
        {resendEmailStatus && <p>{resendEmailStatus}</p>}
      </div>
    )
  } else {
    return(
        <>
          {session && userInTable ? 
          <div>
            <h1>Welcome {userInTable?.name}!</h1>
            <h4>Your Sirch Coins account has been created and you may now use all of the Sirch Coin services!</h4>
            <div className="button-container">
              <Link to="/" className="action-btn">
                Get Started!
              </Link>
            </div>
          </div>
          : <h1> Verifying... </h1> }
        </>
    )
  }
}