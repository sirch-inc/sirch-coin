import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../AuthContext"
import supabase from "../../Config/supabaseConfig"


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
          console.log("Payment validated:", data);
          setPaymentDetails(data);
        }
      } catch (error) {
        setPaymentError(error.message || "An error occurred");
        alert("There was an error processing your payment details: ", paymentError)
      }
    };

    if (userInTable?.user_id && paymentIntentId) {
      validatePayment();
    }
  }, [userInTable, paymentIntentId, paymentError]);

  return (
    <>      
    {paymentDetails ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <h1 style={{ color: "green" }}>Payment Successful!</h1>
            <p style={{ color: "black" }}>Thank you for your purchase.</p>
            <p style={{ color: "black" }}>Your transaction with Stripe has been completed successfully. Your transaction details are below: </p>
            <h3>ⓢ {paymentDetails.numberOfCoins} Sirch Coins have been added to your account.</h3>
            <p>You paid: ${paymentDetails.totalAmount} {paymentDetails.currency.toUpperCase()}</p>
            {/* TODO: Probably should think about including some kind of receipt ID for customer service inquiries in the future. REPLACE THIS! */}
            <p>Transaction Reference ID: {paymentDetails.paymentIntentId}</p>
          </div>
      ) : (
        <p>Validating payment...</p>
      )}
      <Link to="/" style={{ textDecoration: "none", color: "blue" }}>
        Back to Home
      </Link>
    </>

  );
}