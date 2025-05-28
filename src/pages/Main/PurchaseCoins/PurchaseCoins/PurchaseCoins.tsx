import { useState, useEffect, useContext } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { AuthContext } from '../../_common/AuthContext';
import supabase from '../../_common/supabaseProvider';
import CheckoutForm from '../CheckoutForm/CheckoutForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '@heroui/react';
import './PurchaseCoins.css';

// Call `loadStripe` outside of the component's render to avoid
// recreating the `Stripe` object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_PUBLISHABLE_KEY);

export default function PurchaseCoins() {
  const [localCoinAmount, setLocalCoinAmount] = useState<number | null>(0);
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [coinAmountError, setCoinAmountError] = useState(false);
  const [pricePerCoin, setPricePerCoin] = useState<number>(0);
  const [localTotalPrice, setLocalTotalPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [minimumPurchase, setMinimumPurchase] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>("Loading...");
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [options, setOptions] = useState<StripeElementsOptions | null>(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // Force type assertion since we know context will be available
  const userInTable = auth?.userInTable;

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

        setPricePerCoin(data.pricePerCoin.toString());
        setLocalTotalPrice(data.minimumPurchase * data.pricePerCoin);
        setCurrency(data.currency);
        setLocalCoinAmount(data.minimumPurchase);
        setMinimumPurchase(data.minimumPurchase);
      } catch (error) {
        console.error("An exception occurred:", error instanceof Error ? error.message : String(error));
        navigate('/error', { replace: true });
      }
    };
 
    fetchQuote();
  }, [userInTable, navigate]);

  const handleCheckout = async () => {
    if (!userInTable || !localCoinAmount) return;

    setCoinAmount(localCoinAmount);
    setTotalPrice(localTotalPrice);
    setShowCheckoutForm(true);

    const totalAmountInCents = +(localTotalPrice * 100).toFixed(0);

    setOptions({
      mode: 'payment',
      amount: totalAmountInCents,
      currency: currency.toLowerCase(),
      appearance: {
        theme: 'night',
        labels: 'floating',
      }
    } as StripeElementsOptions);
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (newValue === '') {
      setLocalCoinAmount(null);
      setCoinAmountError(false);
      setLocalTotalPrice(0);
      return;
    }
  
    const numValue = parseInt(newValue, 10);
    if (!isNaN(numValue)) {
      setLocalCoinAmount(numValue);
      setLocalTotalPrice(numValue * pricePerCoin);
      setCoinAmountError(minimumPurchase ? numValue < minimumPurchase : false);
    } else {
      setCoinAmountError(true);
    }
  };

  const handleBlur = () => {
    if (!minimumPurchase) return;
    
    if (!localCoinAmount || localCoinAmount < minimumPurchase) {
      setLocalCoinAmount(minimumPurchase);
      setCoinAmountError(false);
      setLocalTotalPrice(minimumPurchase * pricePerCoin);
    }
  };

  const formatPrice = (price: number): string => {
    return Number(price).toFixed(2);
  }

  const formatCurrency = (curr: string): string => {
    return curr.toUpperCase();
  }

  return (
    <div>
      <div className='purchase-container'>
        <h2>Buy Sirch Coins ⓢ</h2>
        <h3>How many Sirch Coins ⓢ would you like to purchase?</h3>
        { pricePerCoin === 0
          ? <p>Current quote: ⓢ 1 = Loading... {currency}</p>
          : <p>Current quote: ⓢ 1 = ${formatPrice(pricePerCoin)} {currency.toUpperCase()}</p>
        }
        <div className='purchase-form'>
          <span className='sirch-symbol-large'>ⓢ</span>
          <input
            className='coin-input'
            type='number'
            name='coins'
            placeholder="Number of coins to purchase"
            value={localCoinAmount ?? ''}
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
          <Button 
            className='big-btn'
            onClick={handleCheckout}
            disabled={coinAmountError || !localCoinAmount || !minimumPurchase || localCoinAmount < minimumPurchase}
          >
            Complete purchase...
          </Button>
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
                  options={options ?? {
                    mode: 'payment',
                    amount: 0,
                    currency: currency.toLowerCase(),
                    appearance: {
                      theme: 'night',
                      labels: 'floating',
                    }
                  }}
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
        <Button 
          className='big-btn'
          onClick={() => { navigate(-1); }}
        >
          Back
        </Button>
      </div>
    </div>
  );
}