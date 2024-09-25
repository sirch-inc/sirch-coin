import { useState, useEffect, useContext, useMemo } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import supabase from "./App/supabaseConfig";
import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from "@supabase/supabase-js";
import CheckoutForm from "./Stripe/CheckoutForm";


export default function Purchase() {
  // const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [localCoinAmount, setLocalCoinAmount] = useState(5);
  const [coinAmount, setCoinAmount] = useState(5);
  const [coinAmountError, setCoinAmountError] = useState(false);
  const [pricePerCoin, setPricePerCoin] = useState("Loading...");
  const [localTotalPrice, setLocalTotalPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState("Loading...");
  const [currency, setCurrency] = useState("Loading...");
  const [paymentIntentId, setPaymentIntentId] = useState(null)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const { userInTable } = useContext(AuthContext);

  // const options = useMemo(() => ({clientSecret}), [clientSecret]);


  // Call `loadStripe` outside of the component’s render to avoid
  // recreating the `Stripe` object on every render
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_PUBLISHABLE_KEY);


  // useEffect(() => {
  //   setStripePromise(loadStripe(import.meta.env.VITE_STRIPE_API_PUBLISHABLE_KEY))
  // }, [])

  // load the user's initial data (balance, etc)
  useEffect(() => {
    const loadInitialData = async () => {
      if (!userInTable) return;
  
      // TODO: fetch the minimum number of coins to satisfy Stripe's $0.50 minimum
      const { data, error } = await supabase.functions.invoke('price-per-coin', {
        body: {
          numberOfCoins: 5  
        }
      });
  
      // TODO: Handle error messaging for user
      if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json();
        console.error('Function returned an error: ', errorMessage);
      } else if (error instanceof FunctionsRelayError) {
        console.error('Relay error: ', error.message);
      } else if (error instanceof FunctionsFetchError) {
        console.error('Fetch error: ', error.message);
      } else {
        setPricePerCoin(data.pricePerCoin);
        setLocalTotalPrice(data.totalAmount);
        setCurrency(data.currency);
      }
    };
  
    loadInitialData();
  }, [userInTable]);

  const handleCheckout = async () => {
    if (!userInTable || localCoinAmount === '') return;

      setCoinAmount(localCoinAmount);
      setTotalPrice(localTotalPrice);
      setCurrency(currency);
      setShowCheckoutForm(true);
      // setPaymentIntentId(data.paymentIntentId)

    // const { data, error } = await supabase.functions.invoke('stripe-create-payment-intent', {
    //   body: {
    //     userId: userInTable?.user_id,
    //     email: userInTable?.email,
    //     numberOfCoins: Math.floor(localCoinAmount)
    //   }
    // });

    // // TODO: Handle error messaging for user
    // if (error instanceof FunctionsHttpError) {
    //   const errorMessage = await error.context.json();
    //   console.error('Function returned an error: ', errorMessage);
    // } else if (error instanceof FunctionsRelayError) {
    //   console.error('Relay error: ', error.message);
    // } else if (error instanceof FunctionsFetchError) {
    //   console.error('Fetch error: ', error.message);
    // } else {
      // setClientSecret(data.clientSecret);
      // setCoinAmount(data.numberOfCoins);
      // setTotalPrice(data.totalAmount);
      // setCurrency(data.currency);
      // setPaymentIntentId(data.paymentIntentId)
    // }
  }

  // TODO: Update this logic once Sirch Coins discount period expires (e.g. users can purchase 1 Sirch Coin for $1)
  const handleAmountChange = (e) => {
    const newValue = e.target.value;
    
    if (newValue === '') {
      setLocalCoinAmount('');
      setCoinAmountError(false);
      setLocalTotalPrice(0);
      return;
    }
  
    const numValue = parseInt(newValue, 10);
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

  const formatCurrency = (currency) => {
    return currency.toUpperCase();
  }
  
  const options = {
    mode: 'payment',
    amount: 1099,
    currency: 'usd',
    // Fully customizable with appearance API.
    appearance: {/*...*/},
  };

  return (
    <div>
      <div className="purchase-container">
        <h2>Purchase Sirch Coins</h2>
        <h3>How many Sirch Coins would you like to purchase?</h3>
        {/* TODO: Format for other currencies if we decide to accept them in the future */}
        { pricePerCoin === "Loading..."
          ? <p>Current price per coin: {pricePerCoin}</p>
          : <p>Current price per coin: ${formatPrice(pricePerCoin)}</p>
        }
        <div className="purchase-form">
          <span className="sirch-symbol-large">ⓢ</span>
          <input
            className="coin-input"
            type="number"
            name="coins"
            placeholder="Enter the number of coins you want to purchase"
            value={localCoinAmount}
            onChange={handleAmountChange}
            onBlur={handleBlur}
            // TODO: min needs to be the fetched value
            min="5"
            step="1"
            required
          />
        </div>
        {/* TODO: use the fetched min value here... */}
        <p><strong>Note: At the current time, a minimum purchase of 5 Sirch Coins is required.</strong></p>
        {/* TODO: Add "See more" link with info on Stripe/purchasing */}
        <p>Sirch Coins uses the payment provider Stripe for secure transactions. See more...</p>
        { localTotalPrice === 0
          ? <h4>Your total price: {totalPrice} {formatCurrency(currency)}</h4>
          : <h4>Your total price: ${formatPrice(localTotalPrice)} {formatCurrency(currency)}</h4>
        }
        <div className="button-group">
        <button 
          className="big-btn"
          onClick={handleCheckout}
          disabled={coinAmountError || localCoinAmount < 5}
        >
          Buy with Stripe
        </button>
      </div>
      </div>
      <div>
        <div>
          {stripePromise && showCheckoutForm &&
            (
            <>
              <div className="overlay"></div>
              <dialog open className="checkout-form-popup">
                <Elements 
                  // key={clientSecret}
                  stripe={stripePromise} 
                  options={options}
                >
                  <CheckoutForm
                    coinAmount={coinAmount}
                    totalPrice={totalPrice}
                    currency={currency}
                    formatPrice={formatPrice}
                    formatCurrency={formatCurrency}
                    // paymentIntentId={paymentIntentId}
                    setShowCheckoutForm={setShowCheckoutForm}
                  />
                </Elements>
              </dialog>
            </>
            )
          }
        </div>
      </div>
      <div className="bottom-btn-container">
        <Link to="/" className="big-btn">
          Back
        </Link>
      </div>
    </div>
  );
}