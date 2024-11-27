import { Link } from 'react-router-dom';


export default function AccountDeleted() {
  return(
    <>
      <h1>Your Sirch Coins account was successfully deleted.</h1>
      <h4>You may create a new account at any time.</h4>
      <div className='bottom-btn-container'>
        <Link to='/' className='big-btn'>
          Got it!
        </Link>
      </div>
    </>
  )
}