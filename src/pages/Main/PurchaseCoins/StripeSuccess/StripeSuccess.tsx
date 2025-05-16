import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../_common/AuthContext';
import supabase from '../../_common/supabaseProvider';
import './StripeSuccess.css';


export default function StripeSuccess() {
  const { paymentIntentId } = useParams();
  const { userInTable, refreshUserBalance } = useContext(AuthContext);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentError, setPaymentError] = useState(false);

  useEffect(() => {
    const validatePayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('stripe-validate-payment', {
          body: {
            userId: userInTable?.user_id,
            paymentIntentId
          }
        });

        if (error) {
          throw new Error(error);
        }

        if (!data) {
          throw new Error("No stripe-validate-payment data received.");
        }
  
        setPaymentDetails(data);
        refreshUserBalance();
      } catch (exception) {
        console.error("An exception occurred:", exception.message);

        setPaymentError(exception.message || "An error occurred");
      }
    };

    if (userInTable?.user_id && paymentIntentId) {
      validatePayment();
    }
  }, [userInTable, paymentIntentId, paymentError, refreshUserBalance]);

  return (
    <>
      {paymentDetails
      ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1 style={{ color: 'green' }}>Purchase Successful!</h1>
            <h3>ⓢ {paymentDetails.amount} have been added to your account</h3>
            {paymentDetails.receipt_link
              ?
                (
                  <a target='_blank' href={paymentDetails.receipt_link} rel="noreferrer">
                    View your Stripe Receipt (opens in a new window/tab).
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
      : paymentError
        ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>There was an error processing your payment.</h1>
            <h3>Please contact Sirch for additional information and check your Sirch Coins Balance and Transactions.</h3>

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