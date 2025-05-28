import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../_common/AuthContext';
import supabase from '../../_common/supabaseProvider';
import { Button } from '@heroui/react';
import './StripeSuccess.css';

interface PaymentDetails {
  amount: number;
  receipt_link?: string;
}

export default function StripeSuccess() {
  const { paymentIntentId } = useParams();
  const auth = useContext(AuthContext);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    const validatePayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('stripe-validate-payment', {
          body: {
            userId: auth?.userInTable?.user_id,
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
        auth?.refreshUserBalance?.();
      } catch (exception) {
        const errorMessage = exception instanceof Error ? exception.message : String(exception);
        console.error("An exception occurred:", errorMessage);
        setPaymentError(errorMessage || "An error occurred");
      }
    };

    if (auth?.userInTable?.user_id && paymentIntentId) {
      validatePayment();
    }
  }, [paymentIntentId, auth]);

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
              <Button 
                as={Link} 
                to='/' 
                className='big-btn'
              >
                Back to Home
              </Button>
            </div>
          </div>
        )
      : paymentError
        ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h1 style={{ color: 'red' }}>Payment Error!</h1>
              <p>An error occurred while validating your payment:</p>
              <p>{paymentError}</p>
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
          )
        : (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h1>Validating payment...</h1>
            </div>
          )
      }
    </>
  );
}