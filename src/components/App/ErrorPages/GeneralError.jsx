import { Link } from 'react-router-dom';


export default function GeneralError() {
  return (
    <>
      <div className='general-error-container'>
        <h3 style={{ color: 'red' }}>We are stuck!</h3>
        <p>
          We apologize but we are unable to process your request at this time.<br/>
          This may have been caused by any of a number of factors including: a problem on our end or on your end.<br/>
          Please try again later.
        </p>
        <p>
          Your Account Details, Sirch Coins, and Transactions are securely stored and will be available to you again soon.
        </p>
        <p>
          For additional support, please contact us:<br></br>
          SMS Text: <a href="sms:+18483293092">+1 (848) 329-3092</a><br/>
          Phone: <a href="tel:+18483293092">+1 (848) 329-3092</a><br/>
          Email: <a href="mailto:josh@sirch.ai">josh@sirch.ai</a><br/>
        </p>
        <p>It would be very helpful if you describe exactly what you were doing when this error occurred,
          your account information, and any other pertinent facts (amounts, parties, etc.).
        </p>
      </div>
  
      <div className='bottom-btn-container'>
        <Link to='/' className='big-btn'>
          Back to Home
        </Link>
      </div>
    </>
  )
}