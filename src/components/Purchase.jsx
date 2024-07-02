import { useState, useEffect, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import supabase from "../Config/supabaseConfig";
import CheckoutForm from "./Stripe/CheckoutForm";


export default function Purchase() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const { userInTable } = useContext(AuthContext);

  // TODO: Fetch the publishableKey from the backend somehow - rpc function call?
  useEffect(() => {
    fetch('/config').then(async(r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  // TODO: Fetch the clientSecret from the backend - rpc or edge function?
  useEffect(() => {
    fetch('/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({})
    }).then(async(r) => {
      const { clientSecret } = await r.json();
      setClientSecret(clientSecret);
    });
  }, []);

  return (
    <>
      <div>
        {/* Comment out below to get pay now button to load */}
        {/* {stripePromise && clientSecret && 
         <Elements stripe={stripePromise} options={import.meta.env.VITE_STRIPE_TEST_SECRET_KEY}>
          <CheckoutForm/>
         </Elements>} */}
       

         <Elements stripe={stripePromise} options={import.meta.env.VITE_STRIPE_TEST_SECRET_KEY}>
          <CheckoutForm/>
         </Elements>
      </div>
      <div className="bottom-btn-container">
        <Link to="/" className="big-btn-red">
          Back
        </Link>
        <Link to="/purchase" className="big-btn-blue">
          Will do something eventually
        </Link>
      </div>
    </>
  );
}