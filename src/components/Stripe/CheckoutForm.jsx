import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import supabase from "../App/supabaseConfig";
import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from "@supabase/supabase-js";


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
  const [paymentIntentId, setPaymentIntentId] = useState('');

  const handleError = (error) => {
    setIsProcessing(false);
    setMessage(error.message);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe) {
      return;
    }

    setIsProcessing(true);

    // Trigger form validation and wallet collection
    // TODO: wrap in try-catch
    const {error: submitError} = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    // TODO: wrap in try-catch
    const { data: createPaymentIntentData, error: createPaymentIntentError } = await supabase.functions.invoke('stripe-create-payment-intent', {
      body: {
        userId: userInTable?.user_id,
        email: userInTable?.email,
        numberOfCoins: Math.floor(coinAmount)
      }
    });

    // TODO: Handle error messaging for user
    if (createPaymentIntentError instanceof FunctionsHttpError) {
      const errorMessage = await createPaymentIntentError.context.json();
      console.error('Function returned an error: ', errorMessage);
    } else if (createPaymentIntentError instanceof FunctionsRelayError) {
      console.error('Relay error: ', createPaymentIntentError.message);
    } else if (createPaymentIntentError instanceof FunctionsFetchError) {
      console.error('Fetch error: ', createPaymentIntentError.message);
    }

    const clientSecret = createPaymentIntentData.clientSecret;
    const paymentIntentId = createPaymentIntentData.paymentIntentId;
    setPaymentIntentId(createPaymentIntentData.paymentIntentId);

    // TODO: wrap in try-catch
    const { error: confirmPaymentError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/Stripe/Success/${paymentIntentId}`
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

    if (paymentIntentId === '') {
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('stripe-cancel-payment-intent', {
        body: {
          userId: userInTable?.user_id,
          paymentIntentId
        }
      });

      if (error) {
        // TODO: surface this error?
        throw error;        
      }

      if (data) {
        console.log(data)
      }
    } catch (exception) {
        console.error("exception", exception)
    }
  }

  return (
    <>
      <h3>You&apos;re purchasing: <br></br>ⓢ {coinAmount} for a total of ${formatPrice(totalPrice)} {formatCurrency(currency)}</h3>
      {/* TODO: Update this line with final timeout decision for price and update Purchase.jsx accordingly */}
      <p><em>This price is locked in for the next 15 minutes. After that time, you may need to refresh and try again.</em></p>

      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" />
        <button
          id="submit"
          className="big-btn"
          disabled={!stripe || isProcessing}
        >
          <span id="button-text">
            {isProcessing ? "Processing... " : "Buy Sirch Coins"}
          </span>
        </button>
        <button
          className="big-btn"
          onClick={handleCancel}
        >
          Cancel
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
}