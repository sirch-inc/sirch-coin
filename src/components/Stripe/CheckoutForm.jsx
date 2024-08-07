import { PaymentElement } from "@stripe/react-stripe-js";
import { useState, useContext } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import supabase from "../App/supabaseConfig";
import { AuthContext } from "../AuthContext";

// eslint-disable-next-line react/prop-types
export default function CheckoutForm({coinAmount, totalPrice, setShowCheckoutForm, formatPrice, formatCurrency, currency, paymentIntentId}) {
  const stripe = useStripe();
  const elements = useElements();
  const { userInTable } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/Stripe/Success/${paymentIntentId}`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsProcessing(false);
  };

  const handleCancelPaymentIntent = async () => {
    setShowCheckoutForm(false)
    try {
      const { data, error } = await supabase.functions.invoke('cancel-payment-intent', {
        body: {
          userId: userInTable?.user_id,
          paymentIntentId: paymentIntentId
        }
      });

      if (error) throw error;
      // TODO: remove console logs
      if (data) {
        console.log(data)
      }
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <>
    <h3>You&apos;re purchasing: <br></br>ⓢ {coinAmount} Sirch Coins for a total of ${formatPrice(totalPrice)} {formatCurrency(currency)}</h3>
    {/* TODO: Update this line with final timeout decision for price and update Purchase.jsx accordingly */}
    <p><em>This price is locked in for the next 15 minutes. After that time, you may need to refresh and try again.</em></p>
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button  className="big-btn" disabled={isProcessing || !stripe || !elements} id="submit">
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Buy Sirch Coins"}
        </span>
      </button>
      {/* TODO: add onClick handleCancelPaymentIntent */}
      <button className="big-btn" onClick={handleCancelPaymentIntent}>
        Cancel
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
    </>
  );
}