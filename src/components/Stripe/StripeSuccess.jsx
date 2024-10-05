import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import supabase from '../App/supabaseConfig';


export default function StripeSuccess() {
  const { paymentIntentId } = useParams();
  const { userInTable } = useContext(AuthContext);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    const validatePayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('stripe-validate-payment', {
          body: {
            userId: userInTable?.user_id,
            paymentIntentId
          }
        });

        if (error) throw error;

        if (data) {
          setPaymentDetails(data);
        }
      } catch (error) {
        setPaymentError(error.message || "An error occurred");
        // TODO: Handle alert to user and redirect(?)
        alert("There was an error processing your payment details:\n" + paymentError)
      }
    };

    if (userInTable?.user_id && paymentIntentId) {
      validatePayment();
    }
  }, [userInTable, paymentIntentId, paymentError]);

  const formatPrice = (price) => {
    return Number(price).toFixed(2);
  }

  return (
    <>      
      {paymentDetails
      ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1 style={{ color: 'green' }}>Purchase Successful!</h1>
            <h3>ⓢ {paymentDetails.numberOfCoins} have been added to your account</h3>
            {/* TODO: Probably should think about including some kind of receipt ID for customer service inquiries in the future. REPLACE THIS! */}
            {paymentDetails.receipt_link
              ?
                (
                  <a target='_blank' href={paymentDetails.receipt_link}>
                    View your Stripe Receipt (opens in a new window).
                  </a>
                )
              :
                (
                  <p>A receipt will be sent to your email address.</p>
                )
            }
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Link to='/' className='big-btn'>
                Back to Home
              </Link>
            </div>
          </div>
        )
      : (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h1>Please wait, validating payment...</h1>
        </div>
        )
      }
    </>
  );
}