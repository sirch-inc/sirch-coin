import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
// import supabase from "../Config/supabaseConfig";


export default function StripeSuccess() {
  const { paymentIntentId } = useParams();
  // const validatePayment = async () => {

  //   const paymentIntentId = 

  //   const { data, error } = await supabase.functions.invoke('validate-payment', {
  //     body: {
  //       userId: userInTable?.user_id,
  //       email: userInTable?.email,
  //       numberOfCoins: Math.floor(localCoinAmount)
  //     }
  //   });
  // }
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