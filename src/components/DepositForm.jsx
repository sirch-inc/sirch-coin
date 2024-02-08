import React, { useState, useRef, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

const DepositForm = () => {
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [containerVisible, setContainerVisible] = useState(true);
  const [successVisible, setSuccessVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(0);
  const paymentElementRef = useRef(null);
  
  useEffect(() => {
    // Load stripe and set it in state
    const stripeKey = "pk_test_6rOaG7p9vtW2VyduXtVfr7JV00sqg9HpxQ";
    loadStripe(stripeKey).then(setStripe);
  }, []);

  const initializeStripe = async () => {
    const response = await fetch(
      "https://sirchcoinv1-production.up.railway.app/api/v1/payments/initialize-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numberOfCoins: amount,
          email,
        }),
      }
    );
    const data = await response.json();
    if (data.clientSecret) {
      setClientSecret(data.clientSecret);
      if (stripe) {
        const elements = stripe.elements();
        setElements(elements);
        const card = elements.create("card"); // Create an instance of the card Element
        card.mount(paymentElementRef.current); // Mount the Element to the DOM
      }
    } else {
      console.error("Failed to initialize payment");
    }
  };

  const handleClick = async () => {
    if (!stripe || !elements) {
      await initializeStripe();
    } else {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement('card'), // Use the card Element
          billing_details: {
            email: email,
          },
        },
      });
      if (result.error) {
        // Show error to your customer (e.g., insufficient funds)
        console.error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setSuccessVisible(true);
          setContainerVisible(false);
          setPaymentIntent(result.paymentIntent);
        }
      }
    }
  };

  return (
    <div>
      {containerVisible && (
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div ref={paymentElementRef} />
          <button onClick={handleClick}>
            Submit
          </button>
        </div>
      )}
      {successVisible && (
        <div className="success">Payment succeeded! {paymentIntent && paymentIntent.id}</div>
      )}
    </div>
  );
};

export default DepositForm;
