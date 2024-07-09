import { useState, useEffect, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import supabase from "../Config/supabaseConfig";
import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from "@supabase/supabase-js";
import CheckoutForm from "./Stripe/CheckoutForm";


export default function Purchase() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [coinAmount, setCoinAmount] = useState(10)
  const { userInTable } = useContext(AuthContext);

  useEffect(() => {
    setStripePromise(loadStripe(import.meta.env.VITE_STRIPE_TEST_PUBLISHABLE_KEY))
  }, [])

  useEffect(()=> {
    if (!userInTable) return;

    const stripeCreatePaymentIntent = async () => {
      const { data, error } = await supabase.functions.invoke('stripe-create-payment-intent', {
        body: {
          userId: userInTable?.user_id,
          email: userInTable?.email,
          numberOfCoins: coinAmount
        }
      });
  
      if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json();
        console.log('Function returned an error: ', errorMessage);
      } else if (error instanceof FunctionsRelayError) {
        console.log('Relay error: ', error.message);
      } else if (error instanceof FunctionsFetchError) {
        console.log('Fetch error: ', error.message);
      } else {
        console.log("Data: ", data);
        setClientSecret(data.clientSecret)
      }
    }
    stripeCreatePaymentIntent();
  }, [userInTable])

  return (
    <div className="purchase-container">
      <div>
        <h2>How many Sirch Coins would you like to purchase?</h2>
        <input
          type="number"
          name="coins"
          placeholder="Enter the number of coins you want to purchase"
          value= {coinAmount}
          onChange={(e) => setCoinAmount(e.target.value)}
          required
        >
        </input>
        <p>Sirch Coins uses the payment provider Stripe for secure transactions. See more...</p>
      </div>
      <div>
        {stripePromise && clientSecret && 
         <Elements stripe={stripePromise} options={{clientSecret}}>
          <CheckoutForm/>
         </Elements>}
      </div>
      <div className="bottom-btn-container">
        <Link to="/" className="big-btn-red">
          Back
        </Link>
        <Link to="/purchase" className="big-btn-blue">
          Will do something eventually
        </Link>
      </div>
    </div>
  );
}