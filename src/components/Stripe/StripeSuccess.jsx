import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../AuthContext"
import supabase from "../../Config/supabaseConfig"


export default function StripeSuccess() {
  const { paymentIntentId } = useParams();
  const { userInTable } = useContext(AuthContext);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);

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
        console.log("Payment validation failed:", error);
        setError(error.message || "An error occurred");
      }
    };

    if (userInTable?.user_id && paymentIntentId) {
      validatePayment();
    }
  }, [userInTable, paymentIntentId]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1 style={{ color: "green" }}>Payment Successful!</h1>
      {paymentIntentId && <p>Payment Intent ID: {paymentIntentId}</p>}
      <p style={{ color: "black" }}>Thank you for your purchase.</p>
      <p style={{ color: "black" }}>Your transaction with Stripe has been completed successfully.</p>
      <Link to="/" style={{ textDecoration: "none", color: "blue" }}>
        Back to Home
      </Link>
    </div>
  );
}