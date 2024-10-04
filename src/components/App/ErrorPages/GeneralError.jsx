import { Link } from 'react-router-dom';


export default function GeneralError() {
  return (
    <>
      <div className='general-error-container'>
        <h3 style={{ color: 'red' }}>We are stuck!</h3>
        <p>We apologize but we are unable to process your request at this time.<br></br>Please try again later!</p>
        <p>Your Account Details and Sirch Coins are safely stored and will be available to you soon.</p>
      </div>
  
      <div className='bottom-btn-container'>
        <Link to='/' className='big-btn'> Back </Link>
      </div>
    </>
  )
}