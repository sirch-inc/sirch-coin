import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';


export default function VerifyAccount() {
  const { session } = useContext(AuthContext);

  return(
    <>
      {
        !session ? (
          <>
            <h1>Please Check Your Email</h1>
            <p>A verification email was sent to the address provided.</p>
            <p>Please click the link in that email to verify your new account.</p>
            <p>To ensure your account&apos;s security, this process may take a few minutes.</p>
          </>
        ) : (
          <>
            <h2>You are currently logged in.</h2>
            <br/>
            <h3>You have already verified this account and no further action is necessary.</h3>
            <br/>
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