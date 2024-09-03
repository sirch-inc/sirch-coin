import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../AuthContext";
import supabase from "../App/supabaseConfig";


export default function StripeSuccess() {
  const { paymentIntentId } = useParams();
  const { userInTable } = useContext(AuthContext);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    const validatePayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('validate-payment', {
          body: {
            userId: userInTable?.user_id,
            paymentIntentId: paymentIntentId,
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
    {paymentDetails ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h1 style={{ color: "green" }}>Payment Successful!</h1>
          <p style={{ color: "black" }}>Thank you for your purchase.</p>
          <h3>ⓢ {paymentDetails.numberOfCoins} Sirch Coins have been added to your account.</h3>
          <p>You paid: $ {formatPrice(paymentDetails.totalAmount)} {paymentDetails.currency.toUpperCase()} for this transaction.</p>
          {/* TODO: Probably should think about including some kind of receipt ID for customer service inquiries in the future. REPLACE THIS! */}
          {paymentDetails.receipt_link ? (
            <a target="_blank" href={paymentDetails.receipt_link}>
              View your Stripe Receipt (opens in new tab)
            </a>
          ) : (
            <p>A Stripe Receipt will be sent to your email address.</p>
          )
          }
          <div style={{ textAlign: "center", padding: "50px" }}>
          <Link to="/" className="big-btn-blue">
            Back to Home
          </Link>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "50px" }}>
        <h1>Please wait, validating payment...</h1>
        </div>
      )}
    </>
  );
}