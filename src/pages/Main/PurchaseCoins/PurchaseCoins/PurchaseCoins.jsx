import { useState, useEffect, useContext } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AuthContext } from '../../AuthContext';
import supabase from '../../_common/supabaseProvider';
import CheckoutForm from '../CheckoutForm/CheckoutForm';
import { useNavigate } from 'react-router-dom';
import './PurchaseCoins.css';


// Call `loadStripe` outside of the component’s render to avoid
// recreating the `Stripe` object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_PUBLISHABLE_KEY);

export default function PurchaseCoins() {
  const [localCoinAmount, setLocalCoinAmount] = useState(0);
  const [coinAmount, setCoinAmount] = useState(0);
  const [coinAmountError, setCoinAmountError] = useState(false);
  const [pricePerCoin, setPricePerCoin] = useState("Loading...");
  const [localTotalPrice, setLocalTotalPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState("Loading...");
  const [minimumPurchase, setMinimumPurchase] = useState(null);
  const [currency, setCurrency] = useState("Loading...");
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [options, setOptions] = useState(null);
  const { userInTable } = useContext(AuthContext);
  const navigate = useNavigate();

  
  // fetch current quote
  useEffect(() => {
    const fetchQuote = async () => {
      if (!userInTable) return;
    
      try {
        const { data, error } = await supabase.functions.invoke('get-coin-purchase-quote', {
          body: {
            purchaseProvider: 'STRIPE'
          }
        });

        if (error) {
          throw new Error(error);
        }

        if (!data) {
          throw new Error("No quote was returned.");
        }

        setPricePerCoin(data.pricePerCoin);
        setLocalTotalPrice(data.minimumPurchase * data.pricePerCoin);
        setCurrency(data.currency);
        setLocalCoinAmount(data.minimumPurchase);
        setMinimumPurchase(data.minimumPurchase);
      } catch (exception) {
        console.error("An exception occurred:", exception.message);
  
        navigate('/error', { replace: true });
      }
    };
 
    fetchQuote();
  }, [userInTable, navigate]);

  const handleCheckout = async () => {
    if (!userInTable || localCoinAmount === '') return;

    setCoinAmount(localCoinAmount);
    setTotalPrice(localTotalPrice);
    setCurrency(currency);
    setShowCheckoutForm(true);

    const totalAmountInCents = +(localTotalPrice * 100).toFixed(0);

    setOptions({
      mode: 'payment',
      amount: totalAmountInCents,
      currency,
      // TODO: finalize Stripe Elements styles after app has been fully designed
      appearance: {
        theme: 'night',
        labels: 'floating',
        // TODO: use same font as app, see Stripe docs
        // fontFamily: 'Haskoy-bold',
      }
    });
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
      setCoinAmountError(numValue < minimumPurchase);
    } else {
      setCoinAmountError(true);
    }
  };

  const handleBlur = () => {
    if (localCoinAmount === '' || localCoinAmount < minimumPurchase) {
      setLocalCoinAmount(minimumPurchase);
      setCoinAmountError(false);
      setLocalTotalPrice(minimumPurchase * parseFloat(pricePerCoin));
    }
  };

  const formatPrice = (price) => {
    return Number(price).toFixed(2);
  }

  const formatCurrency = (currency) => {
    return currency.toUpperCase();
  }

  return (
    <div>
      <div className='purchase-container'>
        <h2>Buy Sirch Coins ⓢ</h2>
        <h3>How many Sirch Coins ⓢ would you like to purchase?</h3>
        { pricePerCoin === "Loading..."
          ? <p>Current quote: ⓢ 1 = {pricePerCoin} {currency}</p>
          : <p>Current quote: ⓢ 1 = ${formatPrice(pricePerCoin)} {currency.toUpperCase()}</p>
        }
        <div className='purchase-form'>
          <span className='sirch-symbol-large'>ⓢ</span>
          <input
            className='coin-input'
            type='number'
            name='coins'
            placeholder="Number of coins to purchase"
            value={localCoinAmount}
            onChange={handleAmountChange}
            onBlur={handleBlur}
            // TODO: min needs to be the fetched value
            min={minimumPurchase?.toString()}
            step='1'
            required
          />
        </div>
        {/* TODO: use the fetched min value here... */}
        <p><strong>Note: At the current time, a minimum purchase of ⓢ {minimumPurchase} is required.</strong></p>
        {/* TODO: Add "See more" link with info on Stripe/purchasing */}
        <p>Sirch Coins uses the payment provider Stripe for secure transactions. See more...</p>
        { localTotalPrice === 0
            ? <h4>Your total price: {totalPrice} {formatCurrency(currency)}</h4>
            : <h4>Your total price: ${formatPrice(localTotalPrice)} {formatCurrency(currency)}</h4>
        }
        <div className='button-group'>
          <button 
            className='big-btn'
            onClick={handleCheckout}
            disabled={coinAmountError || localCoinAmount < minimumPurchase}
          >
            Complete purchase...
          </button>
        </div>
      </div>
      <div>
        <div>
          {stripePromise && showCheckoutForm &&
            (
            <>
              <div className='overlay'></div>
              <dialog open className='checkout-form-dialog'>
                <Elements
                  stripe={stripePromise}
                  options={options}
                >
                  <CheckoutForm
                    coinAmount={coinAmount}
                    totalPrice={totalPrice}
                    currency={currency}
                    formatPrice={formatPrice}
                    formatCurrency={formatCurrency}
                    setShowCheckoutForm={setShowCheckoutForm}
                  />
                </Elements>
              </dialog>
            </>
            )
          }
        </div>
      </div>
      
      <div className='bottom-btn-container'>
        <button className='big-btn'
          onClick={() => { navigate(-1); }}>
          Back
        </button>
      </div>
    </div>
  );
}