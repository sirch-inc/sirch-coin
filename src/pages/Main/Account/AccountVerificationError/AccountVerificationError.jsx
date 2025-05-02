import PropTypes from 'prop-types';
import './AccountVerificationError.css';


export default function AccountVerificationError(props) {
  const { userEmail, setUserEmail, resendVerificationEmail, emailSendStatus } = props;

  return (
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
}

AccountVerificationError.propTypes = {
  userEmail: PropTypes.string.isRequired,
  setUserEmail: PropTypes.func.isRequired,
  resendVerificationEmail: PropTypes.func.isRequired,
  emailSendStatus: PropTypes.string
};

AccountVerificationError.defaultProps = {
  emailSendStatus: ''
};