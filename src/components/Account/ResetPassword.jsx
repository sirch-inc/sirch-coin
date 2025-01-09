import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import ChangePassword from './ChangePassword';
import ResetPasswordRequest from '../Account/ResetPasswordRequest';


export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, session } = useContext(AuthContext);
  const [isPasswordRecoverySession, setIsPasswordRecoverySession] = useState(false);
  const isVerificationError = location.hash.includes('error=access_denied');

  // check if the PASSWORD_RECOVERY event is present
  useEffect(() => {
    (event === 'PASSWORD_RECOVERY') && setIsPasswordRecoverySession(true);
  }, [event]);
  
  return (
    <>
      <h1>Reset Password</h1>

      {!session || isPasswordRecoverySession ?
        (
          <>
            {!isVerificationError ?
              (
                <>
                  <ChangePassword
                    isPasswordRecoverySession={isPasswordRecoverySession}
                  />
                </>
              ) : (
                <>
                  <h2>There was a problem verifying your reset-password link.</h2>
                  <p>
                    Your email reset-password link is invalid, has expired, or has already been used.
                    <br/>
                    If you&apos;ve already reset your password, please try <a href='/login'>logging in</a>.
                    <br/>
                    Alternatively, you can request a new reset-password link below.
                  </p>

                  <ResetPasswordRequest
                    isVerificationError={isVerificationError}
                  />
                </>
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