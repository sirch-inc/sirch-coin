import { Link } from 'react-router-dom';


export default function StripeFailure() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: 'red' }}>Payment Failed!</h1>
      <p style={{ color: 'black' }}>Please contact support.</p>
      <p style={{ color: 'black' }}>Your transaction with Stripe has failed</p>
      <Link to='/' style={{ textDecoration: 'none', color: 'blue' }}>
        Back to Home
      </Link>
    </div>
  );
}