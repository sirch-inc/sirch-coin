import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../_common/AuthContext';
import { PaymentElement } from '@stripe/react-stripe-js';
import { StripeError } from '@stripe/stripe-js';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import supabase from '../../_common/supabaseProvider';
import { Button } from '@heroui/react';
import './CheckoutForm.css';

interface CheckoutFormProps {
  coinAmount: number;
  totalPrice: number;
  setShowCheckoutForm: (show: boolean) => void;
  formatPrice: (price: number) => string;
  formatCurrency: (currency: string) => string;
  currency: string;
}

export default function CheckoutForm({
    coinAmount,
    totalPrice,
    setShowCheckoutForm,
    formatPrice,
    formatCurrency,
    currency
  }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const auth = useContext(AuthContext);
  const userInTable = auth?.userInTable;
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleError = (error: StripeError) => {
    setIsProcessing(false);
    setMessage(error.message ?? 'An error occurred');
  }

  const handleSubmit = async () => {
    if (!stripe || !elements || !userInTable) return;

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
    
    try {
      if (paymentIntentId === null) {
        const { data: createPaymentIntentData, error: createPaymentIntentError } = await supabase.functions.invoke('stripe-create-payment-intent', {
          body: {
            userId: userInTable?.user_id,
            email: userInTable?.email,
            numberOfCoins: Math.floor(coinAmount)
          }
        });

        if (createPaymentIntentError) {
          throw new Error(typeof createPaymentIntentError === 'string' ? createPaymentIntentError : 'Failed to create payment intent');
        }

        currentClientSecret = createPaymentIntentData.clientSecret;
        currentPaymentIntentId = createPaymentIntentData.paymentIntentId;
      }

      setClientSecret(currentClientSecret);
      setPaymentIntentId(currentPaymentIntentId);

      if (!currentClientSecret) {
        throw new Error('No client secret available');
      }

      // confirm the payment with the values in the elements
      const { error: confirmPaymentError } = await stripe.confirmPayment({
        elements,
        clientSecret: currentClientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/stripe/success/${currentPaymentIntentId}`
        },
      });

      if (confirmPaymentError) {
        throw confirmPaymentError;
      }
    } catch (exception) {
      console.error("An exception occurred:", exception instanceof Error ? exception.message : 'Unknown error');
      navigate('/error', { replace: true });
    } finally {
      // try to cancel any created paymentIntent
      if (currentPaymentIntentId) {
        cancelPaymentIntent(currentPaymentIntentId);
      }
    }
  };

  const handleCancel = () => {
    setIsProcessing(false);
    setShowCheckoutForm(false);

    if (paymentIntentId === null) return;

    cancelPaymentIntent(paymentIntentId);
  }

  const cancelPaymentIntent = async (paymentIntentIdToCancel: string) => {
    if (paymentIntentIdToCancel === null) return;

    try {
      const { error } = await supabase.functions.invoke('stripe-cancel-payment-intent', {
        body: {
          paymentIntentId: paymentIntentIdToCancel
        }
      });
  
      if (error) {
        throw new Error(typeof error === 'string' ? error : 'Failed to cancel payment intent');
      }
    } catch (exception) {
      console.error("An exception occurred:", exception instanceof Error ? exception.message : 'Unknown error');
      navigate('/error', { replace: true });
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className='payment-dialog'>
      <div className='payment-header'>
        <h3>You&apos;re purchasing: <br></br>ⓢ {coinAmount} for a total of ${formatPrice(totalPrice)} {formatCurrency(currency)}</h3>
        {/* TODO: Update this line with final timeout decision for price and update the page accordingly */}
        <p><em>This price is locked in for the next 15 minutes. After that time, you may need to refresh and try again.</em></p>
      </div>

      <div className='payment-form'>
        <PaymentElement id='payment-element' />
      </div>

      <div className='payment-footer'>
        {message &&
          <div style={{ color: 'red' }}>There was an issue with your purchase. Please review your order details.<br></br>{message}</div>
        }

        <Button
          id='submit'
          className='big-btn'
          onPress={handleSubmit}
          disabled={!stripe || isProcessing}
        >
          <span id='button-text'>
            {isProcessing ? "Processing... " : "Confirm Purchase"}
          </span>
        </Button>

        <Button
          className='big-btn'
          onPress={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}