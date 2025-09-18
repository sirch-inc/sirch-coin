import { useState, useCallback, useMemo } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import CheckoutForm from '../CheckoutForm/CheckoutForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '@heroui/react';
import { SirchCoinInput } from '../../../../components/HeroUIFormComponents';
import { useFormValidation, useCoinQuote } from '../../../../hooks';
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
  
  // Use the quote service hook
  const { 
    quote, 
    isLoading: isQuoteLoading, 
    error: quoteError, 
    refreshQuote,
    formatPrice,
    formatCurrency,
    getQuote
  } = useCoinQuote({ 
    provider: 'STRIPE'
  });

  // State for checkout
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [options, setOptions] = useState<StripeElementsOptions | null>(null);
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Initialize form data
  const initialFormData: PurchaseCoinsFormData = {
    amount: quote?.minimumPurchase?.toString() || ''
  };

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
      
      if (quote?.minimumPurchase && !isNaN(numAmount) && numAmount < quote.minimumPurchase) {
        return { isValid: false, message: `Minimum purchase is ⓢ ${quote.minimumPurchase}` };
      }
      return { isValid: true };
    }
  }), [quote?.minimumPurchase]);

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

  const handleCheckout = useCallback(async () => {
    if (!quote) return;

    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) return;

    setCoinAmount(amount);
    const totalPrice = amount * quote.pricePerCoin;
    setTotalPrice(totalPrice);
    setShowCheckoutForm(true);

    const totalAmountInCents = +(totalPrice * 100).toFixed(0);

    setOptions({
      mode: 'payment',
      amount: totalAmountInCents,
      currency: quote.currency.toLowerCase(),
      appearance: {
        theme: 'night',
        labels: 'floating',
      }
    } as StripeElementsOptions);
  }, [quote, formData.amount]);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    handleInputChange('amount', newValue);
  }, [handleInputChange]);

  const handleBlur = useCallback(() => {
    if (!quote?.minimumPurchase) return;
    
    const currentAmount = parseFloat(formData.amount);
    if (!currentAmount || currentAmount < quote.minimumPurchase) {
      handleInputChange('amount', quote.minimumPurchase.toString());
    }
  }, [quote?.minimumPurchase, formData.amount, handleInputChange]);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCheckout();
  }, [handleCheckout]);

  // Handle quote error
  if (quoteError) {
    navigate('/error', { replace: true });
    return null;
  }

  return (
    <div>
      <div className='purchase-container'>
        <h2>Buy Sirch Coins ⓢ</h2>
        <h3>How many Sirch Coins would you like to purchase?</h3>
        
        <form onSubmit={handleSubmit} noValidate>
          <p>Sirch Coins uses the payment provider Stripe for secure transactions. See more...</p>
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
              min={quote?.minimumPurchase?.toString()}
              step='1'
              isRequired
              isInvalid={!!errors.amount || !!errors.minimumPurchase}
              errorMessage={
                errors.amount ? getFieldError('amount') : 
                errors.minimumPurchase ? getFieldError('minimumPurchase') : 
                ""
              }
              pricePerCoin={getQuote()?.pricePerCoin || 0}
              currency={getQuote()?.currency || 'USD'}
              showUsdValue={true}
              onRefreshQuote={refreshQuote}
            />
          </div>
          <div className='bottom-btn-container'>
            <Button 
              type='submit'
              className='big-btn'
              disabled={
                isQuoteLoading ||
                !quote ||
                !!errors.amount || 
                !!errors.minimumPurchase || 
                !formData.amount || 
                parseFloat(formData.amount) < (quote?.minimumPurchase || 0)
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
          {stripePromise && showCheckoutForm && quote &&
            (
            <>
              <div className='overlay'></div>
              <dialog open className='checkout-form-dialog'>
                <Elements
                  stripe={stripePromise}
                  options={options ?? {
                    mode: 'payment',
                    amount: 0,
                    currency: quote.currency.toLowerCase(),
                    appearance: {
                      theme: 'night',
                      labels: 'floating',
                    }
                  }}
                >
                  <CheckoutForm
                    coinAmount={coinAmount}
                    totalPrice={totalPrice}
                    currency={quote.currency}
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
