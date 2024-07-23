import { Link, useParams } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from "../AuthContext"
import supabase from "../../Config/supabaseConfig"


export default function StripeSuccess() {
  const { paymentIntentId } = useParams();
  const { userInTable } = useContext(AuthContext);

  const validatePayment = async () => {
    const { data, error } = await supabase.functions.invoke('validate-payment', {
      body: {
        userId: userInTable?.user_id,
        email: userInTable?.email,
      }
    }
  )
    if (data){
      console.log(data)
    } else {
      console.log("Not working at all")
    }
  }

  validatePayment()
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