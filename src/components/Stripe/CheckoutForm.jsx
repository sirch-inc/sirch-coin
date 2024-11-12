import { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { PaymentElement } from '@stripe/react-stripe-js';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import supabase from '../App/supabaseConfig';


// eslint-disable-next-line react/prop-types
export default function CheckoutForm({
    coinAmount,
    totalPrice,
    setShowCheckoutForm,
    formatPrice,
    formatCurrency,
    currency
  }) {
  const stripe = useStripe();
  const elements = useElements();
  const { userInTable } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  const handleError = (error) => {
    setIsProcessing(false);
    setMessage(error.message);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe) return;

    setIsProcessing(true);

    // validate form submission
    const {error: submitError} = await elements.submit();
    
    if (submitError) {
      handleError(submitError);
      return;
    }

    // create a new payment intent if we don't already have one
    let currentClientSecret = clientSecret;
    let currentPaymentIntentId = paymentIntentId;
    if (paymentIntentId === null) {
      const { data: createPaymentIntentData, error: createPaymentIntentError } = await supabase.functions.invoke('stripe-create-payment-intent', {
        body: {
          userId: userInTable?.user_id,
          email: userInTable?.email,
          numberOfCoins: Math.floor(coinAmount)
        }
      });

      if (createPaymentIntentError) {
        handleError(createPaymentIntentError);
      }

      currentClientSecret = createPaymentIntentData.clientSecret;
      currentPaymentIntentId = createPaymentIntentData.paymentIntentId;
    }

    setClientSecret(currentClientSecret);
    setPaymentIntentId(currentPaymentIntentId);

    // confirm the payment with the values in the elements
    const { error: confirmPaymentError } = await stripe.confirmPayment({
      elements,
      clientSecret: currentClientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/stripe/success/${currentPaymentIntentId}`
      },
    });

    if (confirmPaymentError) {
      handleError(confirmPaymentError);
    }

    setIsProcessing(false);
  };

  const handleCancel = async () => {
    setIsProcessing(false);
    setShowCheckoutForm(false);

    if (paymentIntentId === null) return;

    const { error: cancelPaymentIntentError } = await supabase.functions.invoke('stripe-cancel-payment-intent', {
      body: {
        paymentIntentId
      }
    });

    if (cancelPaymentIntentError) {
      // TODO: surface this error?
      throw cancelPaymentIntentError;        
    }
  }

  return (
    <div className='payment-dialog'>
      <div className='payment-header'>
        <h3>You&apos;re purchasing: <br></br>ⓢ {coinAmount} for a total of ${formatPrice(totalPrice)} {formatCurrency(currency)}</h3>
        {/* TODO: Update this line with final timeout decision for price and update Purchase.jsx accordingly */}
        <p><em>This price is locked in for the next 15 minutes. After that time, you may need to refresh and try again.</em></p>
      </div>

      <div className='payment-form'>
        <PaymentElement id='payment-element' />
      </div>

      <div className='payment-footer'>
        {message &&
          <div style={{ color: 'red' }}>There was an issue with your purchase. Please review your order details.<br></br>{message}</div>
        }

        <button
          id='submit'
          className='big-btn'
          onClick={handleSubmit}
          disabled={!stripe || isProcessing}
        >
          <span id='button-text'>
            {isProcessing ? "Processing... " : "Confirm Purchase"}
          </span>
        </button>

        <button
          className='big-btn'
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}