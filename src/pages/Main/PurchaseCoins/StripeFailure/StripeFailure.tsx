import { Link } from 'react-router-dom';
import { Button } from '@heroui/react';


// TODO: not sure we still need this component...
export default function StripeFailure() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: 'red' }}>Payment Failed!</h1>
      <p style={{ color: 'black' }}>Please contact support.</p>
      <p style={{ color: 'black' }}>Your transaction with Stripe has failed.</p>
      
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Button 
          as={Link} 
          to='/' 
          className='big-btn'
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}