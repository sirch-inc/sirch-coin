import { useState, useEffect, useContext, useMemo } from "react";
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
  const [coinAmount, setCoinAmount] = useState(5);
  const [coinAmountError, setCoinAmountError] = useState(false);
  const [pricePerCoin, setPricePerCoin] = useState("Loading...");
  const [totalPrice, setTotalPrice] = useState("Loading...");
  const [currency, setCurrency] = useState("Loading...");
  const { userInTable } = useContext(AuthContext);
  const options = useMemo(() => ({clientSecret}), [clientSecret])

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
        setClientSecret(data.clientSecret);
        setPricePerCoin(data.pricePerCoin);
        setTotalPrice(data.totalAmount);
        setCurrency(data.currency);
      }
    }
    stripeCreatePaymentIntent();
  }, [userInTable, coinAmount])

  // TODO: Update this logic once Sirch Coins discount period expires (e.g. users can purchase 1 Sirch Coin for $1)
  const handleAmountChange = (e) => {
    const value = e.target.value;
    
    if (value === '') {
      setCoinAmount('');
      setCoinAmountError(false);
      return;
    }

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setCoinAmount(value);
      setCoinAmountError(numValue < 5);
    }
  };

  const handleBlur = () => {
    if (coinAmount !== '' && parseInt(coinAmount, 10) < 5) {
      setCoinAmount('5');
      setCoinAmountError(false);
    }
  };

  return (
    <div className="purchase-container">
      <div>
        <h2>Purchase Sirch Coins</h2>
        <h3>How many Sirch Coins would you like to purchase?</h3>
        {/* TODO: Format for other currencies if we decide to accept them in the future */}
        { pricePerCoin === "Loading..." ? 
          <p>Current cost per coin: {pricePerCoin} </p> : 
          <p>Current cost per coin: ${Number(pricePerCoin).toFixed(2)} </p>
          }
        <p>Currency: {currency.toUpperCase()}</p>
        <span className="sirch-symbol-large">ⓢ</span>
        <input
          className="coin-amount-input"
          type="number"
          name="coins"
          placeholder="Enter the number of coins you want to purchase"
          value= {coinAmount}
          onChange={handleAmountChange}
          onBlur={handleBlur}
          min="5"
          required
        >
        </input>
        <p><strong>Note: At the current time, a minimum purchase of 5 Sirch Coins is required.</strong></p>
        {/* TODO: Add "See more" link with info on Stripe/purchasing */}
        <p>Sirch Coins uses the payment provider Stripe for secure transactions. See more...</p>
        <h4>Your total price: ${totalPrice}</h4>
      </div>
      <div>
          
        {/* TODO: Fix remounting of Elements - clientSecret cannot change */}
        {stripePromise && clientSecret && 
         <Elements 
          key={clientSecret}
          stripe={stripePromise} 
          options={options}
         >
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