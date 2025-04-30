import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import ChangePassword from '../ChangePassword/ChangePassword';
import ResetPasswordRequest from '../ResetPasswordRequest/ResetPasswordRequest';
import './ResetPassword.css';


const VerificationError = () => (
  <>
    <h2>There was a problem verifying your reset-password link.</h2>
    <p>
      Your reset-password link is invalid, has expired, or has already been used.
      <br/>
      If you&apos;ve already reset your password, please try <a href='/login'>logging in</a>.
      <br/>
      Alternatively, you can request a new reset-password link below.
    </p>

    <ResetPasswordRequest standalone={false} />
  </>
);

export default function ResetPassword() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const { authEvent, session } = useContext(AuthContext);
  const [isPasswordRecoverySession, setIsPasswordRecoverySession] = useState(false);
  const verificationError = hash.includes('error=access_denied');

  // check if the PASSWORD_RECOVERY event is present
  useEffect(() => {
    if (authEvent === 'PASSWORD_RECOVERY') {
      setIsPasswordRecoverySession(true);
    }
  }, [authEvent]);
  
  return (
    <>
      <h1>Reset Password</h1>

      {!session || isPasswordRecoverySession ?
        (
          <>
            {verificationError ?
              (
                <VerificationError />
              ) : (
                <ChangePassword standalone={false} />
              )
            }
            
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Link to='/' className='big-btn'>
                Back to Home
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2>You are currently logged in.</h2>
            <br/>
            <h3>You can update your account password under My Account.</h3>
            <br/>
            <div className='bottom-btn-container'>
              <button className='big-btn'
                onClick={() => { navigate(-1); }}>
                Back
              </button>
            </div>
          </>
        )
      }
    </>
  );
}