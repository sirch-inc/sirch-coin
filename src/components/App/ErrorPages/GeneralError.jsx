import { Link } from 'react-router-dom';


export default function GeneralError() {
  return (
    <>
      <div className='general-error-container'>
        <h3 style={{ color: 'red' }}>We are stuck!</h3>
        <p>We apologize but we are unable to process your request at this time.<br></br>Please try again later!</p>
        <p>Your Account Details and Sirch Coins are safely stored and will be available to you soon.</p>
        <br></br>
        <p>
          For additional support, please contact us:<br></br>
          Email: <a href='mailto: support@sirch.org'>support@sirch.org</a><br></br>
          Phone: <a href='tel:+18483293092'>1+ 848 329-3092</a><br></br>
          SMS Text: <a href='sms:+18483293092'>1+ 848 329-3092</a>
        </p>
      </div>
  
      <div className='bottom-btn-container'>
        <Link to='/' className='big-btn'> Back </Link>
      </div>
    </>
  )
}