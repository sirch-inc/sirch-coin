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
  const [localCoinAmount, setLocalCoinAmount] = useState(5);
  const [localTotalPrice, setLocalTotalPrice] = useState(0);
  const [coinAmount, setCoinAmount] = useState(5);
  const [coinAmountError, setCoinAmountError] = useState(false);
  const [pricePerCoin, setPricePerCoin] = useState("Loading...");
  const [totalPrice, setTotalPrice] = useState("Loading...");
  const [currency, setCurrency] = useState("Loading...");
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const { userInTable } = useContext(AuthContext);
  const options = useMemo(() => ({clientSecret}), [clientSecret])

  useEffect(() => {
    setStripePromise(loadStripe(import.meta.env.VITE_STRIPE_TEST_PUBLISHABLE_KEY))
  }, [])

  // TODO: Replace this with a new edge function in supabase instead of creating the payment intent on page load
  useEffect(() => {
    const loadInitialData = async () => {
      if (!userInTable) return;
  
      const { data, error } = await supabase.functions.invoke('price-per-coin', {
        body: {
          numberOfCoins: 5  
        }
      });
  
      // TODO: Handle error messaging for user
      if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json();
        console.log('Function returned an error: ', errorMessage);
      } else if (error instanceof FunctionsRelayError) {
        console.log('Relay error: ', error.message);
      } else if (error instanceof FunctionsFetchError) {
        console.log('Fetch error: ', error.message);
      } else {
        console.log("Data:", data);
        setPricePerCoin(data.pricePerCoin);
        setLocalTotalPrice(data.totalAmount);
        setCurrency(data.currency);
      }
    };
  
    loadInitialData();
  }, [userInTable]);

  const createPaymentIntent = async () => {
    if (!userInTable || localCoinAmount === '') return;

    const { data, error } = await supabase.functions.invoke('stripe-create-payment-intent', {
      body: {
        userId: userInTable?.user_id,
        email: userInTable?.email,
        numberOfCoins: Math.floor(localCoinAmount)
      }
    });

    // TODO: Handle error messaging for user
    if (error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      console.log('Function returned an error: ', errorMessage);
    } else if (error instanceof FunctionsRelayError) {
      console.log('Relay error: ', error.message);
    } else if (error instanceof FunctionsFetchError) {
      console.log('Fetch error: ', error.message);
    } else {
      setClientSecret(data.clientSecret);
      setCoinAmount(data.numberOfCoins);
      setTotalPrice(data.totalAmount);
      setCurrency(data.currency);
      setShowCheckoutForm(true)
    }
  }

  // TODO: Update this logic once Sirch Coins discount period expires (e.g. users can purchase 1 Sirch Coin for $1)
  const handleAmountChange = (e) => {
    const value = e.target.value;
    
    if (value === '') {
      setLocalCoinAmount('');
      setCoinAmountError(false);
      setLocalTotalPrice(0);
      return;
    }
  
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setLocalCoinAmount(numValue);
      setLocalTotalPrice(numValue * parseFloat(pricePerCoin));
      setCoinAmountError(numValue < 5);
    } else {
      setCoinAmountError(true);
    }
  };

  const handleBlur = () => {
    if (localCoinAmount === '' || localCoinAmount < 5) {
      setLocalCoinAmount(5);
      setCoinAmountError(false);
      setLocalTotalPrice(5 * parseFloat(pricePerCoin));
    }
  };

  const formatPrice = (price) => {
    return Number(price).toFixed(2);
  }

  return (
    <div className="purchase-container">
      <div>
        <h2>Purchase Sirch Coins</h2>
        <h3>How many Sirch Coins would you like to purchase?</h3>
        {/* TODO: Format for other currencies if we decide to accept them in the future */}
        { pricePerCoin === "Loading..." ? 
          <p>Current price per coin: {pricePerCoin} </p> : 
          <p>Current price per coin: ${formatPrice(pricePerCoin)} </p>
          }
        <span className="sirch-symbol-large">ⓢ</span>
        <input
          className="coin-amount-input"
          type="number"
          name="coins"
          placeholder="Enter the number of coins you want to purchase"
          value={localCoinAmount}
          onChange={handleAmountChange}
          onBlur={handleBlur}
          min="5"
          step="1"
          required
        />
        <p><strong>Note: At the current time, a minimum purchase of 5 Sirch Coins is required.</strong></p>
        {/* TODO: Add "See more" link with info on Stripe/purchasing */}
        <p>Sirch Coins uses the payment provider Stripe for secure transactions. See more...</p>
        { localTotalPrice === 0 ? 
          <h4>Your total price: {totalPrice} {currency.toUpperCase()}</h4> :
          <h4>Your total price: ${formatPrice(localTotalPrice)} {currency.toUpperCase()}</h4>
        }
        <button 
          onClick={createPaymentIntent} 
          disabled={coinAmountError || localCoinAmount < 5}
        >
          Proceed to Payment
        </button>
      </div>
      <div>
        {/* TODO: Fix remounting of Elements - clientSecret cannot change */}
        <div>
          {stripePromise && clientSecret && showCheckoutForm && (
            <>
              <div className="overlay"></div>
              <dialog open className="checkout-form-popup">
                <Elements 
                  key={clientSecret}
                  stripe={stripePromise} 
                  options={options}
                >
                  <CheckoutForm coinAmount={coinAmount} totalPrice={totalPrice} setShowCheckoutForm={setShowCheckoutForm}/>
                </Elements>
              </dialog>
            </>
          )}
        </div>
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