import { Link } from 'react-router-dom';


export default function VerifyAccount() {
  return(
    // TODO: Style component and add customization (ie. "An email confirmation link was sent to [users@somewhere.com]")
    // TODO: Only make page accessible to a newly created user
    <>
      <h1>Please Check Your Email</h1>
      <p>A verification email was sent to the address provided. Please click the link in that email to verify your new account.</p>
      <p>To ensure your account&apos;s security, this process may take a few minutes.</p>

      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Link to='/' className='big-btn'>
          Back to Home
        </Link>
      </div>
</>
  )
}