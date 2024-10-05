import { Link } from 'react-router-dom';


export default function Help() {
  return (
    <>
      <h2>Help</h2>
      <div className='help-container'>
        <p className='page-text'>
          Sorry, this page isn&apos;t available yet
        </p>
        <p className='page-text'>
          <strong>Please try again later</strong>
        </p>
        <div className='bottom-btn-container'>
          <Link to='/' className='big-btn'>
            Back
          </Link>
        </div>
      </div>
    </>
  );
}