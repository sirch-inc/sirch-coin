import { Link } from 'react-router-dom';


// eslint-disable-next-line react/prop-types
export default function ContactUs() {

  return (
    <div className='contact-us'>
      <h1>Contact Us</h1>
      <p>
        If you have any questions, suggestions, or issues, please feel free to contact us at:<br/>
        SMS Text: <a href="sms:+18483293092">+1 (848) 329-3092</a><br/>
        Phone: <a href="tel:+18483293092">+1 (848) 329-3092</a><br/>
        Email: <a href="mailto:josh@sirch.ai">josh@sirch.ai</a><br/>
      </p>
      <div className='bottom-btn-container'>
        <Link to='/' className='big-btn'>
          Back to Home
        </Link>
      </div>
    </div>
  );
}