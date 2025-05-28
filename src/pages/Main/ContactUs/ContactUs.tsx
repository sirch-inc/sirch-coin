import { useNavigate } from 'react-router-dom';
import { Button } from '@heroui/react';
import './ContactUs.css';


export default function ContactUs() {
  const navigate = useNavigate();

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
        <Button 
          className='big-btn'
          onClick={() => { navigate(-1); }}>
          Back
        </Button>
      </div>
    </div>
  );
}