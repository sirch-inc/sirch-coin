import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { AuthContext } from '../../_common/AuthContext';
import supabase from '../../_common/supabaseProvider';
import CheckoutForm from '../CheckoutForm/CheckoutForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '@heroui/react';
import { SirchCoinInput } from '../../../../components/HeroUIFormComponents';
import { useFormValidation } from '../../../../hooks';
import './PurchaseCoins.css';

// Call `loadStripe` outside of the component's render to avoid
// recreating the `Stripe` object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_PUBLISHABLE_KEY);

// Form data types
interface ValidationErrors extends Record<string, boolean> {
  amount: boolean;
  minimumPurchase: boolean;
}

interface PurchaseCoinsFormData extends Record<string, unknown> {
  amount: string;
}

export default function PurchaseCoins() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  
  // Force type assertion since we know context will be available
  const userInTable = auth?.userInTable;

  // Initialize form data
  const initialFormData: PurchaseCoinsFormData = {
    amount: ''
  };

  // State for purchase configuration
  const [pricePerCoin, setPricePerCoin] = useState<number>(0);
  const [minimumPurchase, setMinimumPurchase] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>("Loading...");
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [options, setOptions] = useState<StripeElementsOptions | null>(null);

  // Validation rules
  const validationRules = useMemo(() => ({
    amount: (value: unknown) => {
      const amount = value as string;
      const numAmount = parseFloat(amount);
      
      if (!amount || amount.trim() === '') {
        return { isValid: false, message: "Amount is required" };
      }
      if (isNaN(numAmount) || numAmount <= 0) {
        return { isValid: false, message: "Please enter a valid amount" };
      }
      return { isValid: true };
    },
    minimumPurchase: (value: unknown) => {
      const amount = value as string;
      const numAmount = parseFloat(amount);
      
      if (minimumPurchase && !isNaN(numAmount) && numAmount < minimumPurchase) {
        return { isValid: false, message: `Minimum purchase is ⓢ ${minimumPurchase}` };
      }
      return { isValid: true };
    }
  }), [minimumPurchase]);

  // Use form validation hook
  const {
    formData,
    errors,
    handleInputChange,
    getFieldError
  } = useFormValidation<PurchaseCoinsFormData, ValidationErrors>({
    initialData: initialFormData,
    validationRules
  });

  // Legacy state for backward compatibility - only keep what's needed
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Calculate current total price for checkout (keeping for legacy compatibility)
  const currentTotalPrice = useMemo(() => {
    const amount = parseFloat(formData.amount);
    return amount && !isNaN(amount) ? amount * pricePerCoin : 0;
  }, [formData.amount, pricePerCoin]);

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
        setCurrency(data.currency);
        handleInputChange('amount', data.minimumPurchase.toString());
        setMinimumPurchase(data.minimumPurchase);
      } catch (error) {
        console.error("An exception occurred:", error instanceof Error ? error.message : String(error));
        navigate('/error', { replace: true });
      }
    };
 
    fetchQuote();
  }, [userInTable, navigate, handleInputChange]);

  const handleCheckout = useCallback(async () => {
    if (!userInTable) return;

    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) return;

    setCoinAmount(amount);
    const totalPrice = amount * pricePerCoin;
    setTotalPrice(totalPrice);
    setShowCheckoutForm(true);

    const totalAmountInCents = +(totalPrice * 100).toFixed(0);

    setOptions({
      mode: 'payment',
      amount: totalAmountInCents,
      currency: currency.toLowerCase(),
      appearance: {
        theme: 'night',
        labels: 'floating',
      }
    } as StripeElementsOptions);
  }, [userInTable, formData.amount, pricePerCoin, currency]);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Update form validation state
    handleInputChange('amount', newValue);
  }, [handleInputChange]);

  const handleBlur = useCallback(() => {
    if (!minimumPurchase) return;
    
    const currentAmount = parseFloat(formData.amount);
    if (!currentAmount || currentAmount < minimumPurchase) {
      handleInputChange('amount', minimumPurchase.toString());
    }
  }, [minimumPurchase, formData.amount, handleInputChange]);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCheckout();
  }, [handleCheckout]);

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
        <h3>How many Sirch Coins would you like to purchase?</h3>
        <p>
          { pricePerCoin === 0
            ? `Quote: ⓢ 1 = Loading...`
            : `Quote: ⓢ 1 = ${formatPrice(pricePerCoin)} ${currency.toUpperCase()}`
          }
          <br></br>
          Note: A minimum purchase of ⓢ {minimumPurchase} is required.
        </p>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className='purchase-form'>
            <SirchCoinInput
              className='coin-input'
              name='coins'
              label="Amount"
              placeholder="Enter number of coins to purchase"
              amount={formData.amount}
              value={formData.amount}
              onChange={handleAmountChange}
              onBlur={handleBlur}
              min={minimumPurchase?.toString()}
              step='1'
              isRequired
              isInvalid={!!errors.amount || !!errors.minimumPurchase}
              errorMessage={
                errors.amount ? getFieldError('amount') : 
                errors.minimumPurchase ? getFieldError('minimumPurchase') : 
                ""
              }
              pricePerCoin={pricePerCoin}
              currency={currency}
              showUsdValue={true}
            />
          </div>
          {/* TODO: Add "See more" link with info on Stripe/purchasing */}
          <p>Sirch Coins uses the payment provider Stripe for secure transactions. See more...</p>
          { currentTotalPrice === 0
              ? <h4>Your total price: {totalPrice} {formatCurrency(currency)}</h4>
              : <h4>Your total price: ${formatPrice(currentTotalPrice)} {formatCurrency(currency)}</h4>
          }
          <div className='bottom-btn-container'>
            <Button 
              type='submit'
              className='big-btn'
              disabled={
                !!errors.amount || 
                !!errors.minimumPurchase || 
                !formData.amount || 
                !minimumPurchase || 
                parseFloat(formData.amount) < minimumPurchase
              }
            >
              Complete purchase...
            </Button>

            <Button 
              className='big-btn'
              onPress={() => { navigate(-1); }}
            >
              Back
            </Button>
          </div>
        </form>
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
    </div>
  );
}