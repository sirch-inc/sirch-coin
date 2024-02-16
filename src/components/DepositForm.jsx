import React, { useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Link } from "react-router-dom";

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
  const btnRef = useRef(null);
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
    const stripeKey = "pk_test_6rOaG7p9vtW2VyduXtVfr7JV00sqg9HpxQ";
    const stripe = await loadStripe(stripeKey);
const s = await loadStripe(stripeKey);
setStripe(s);
    const e = s.elements({
      clientSecret: data.clientSecret,
      loader: "auto",
    });
    setElements(e);
    setClientSecret(data.clientSecret);
    const payEl = e.create("payment", {
      layout: "tabs",
    });
    payEl.mount(paymentElementRef.current);
  };

  

  const handleClick = async () => {
    try {
      if (!stripe) {
        await initializeStripe();
      }
  
      // Confirm the payment
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/stripe/success",
        },
      });
  
      // Check if the payment was successful
      if (result.error) {
        // Payment failed
        console.error("Payment failed:", result.error);
        window.location.href = window.location.origin + "/stripe/Failure";
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        // Payment succeeded
        setContainerVisible(false); // Hide the payment form
        setSuccessVisible(true); // Show success message
        setPaymentIntent(result.paymentIntent.id); // Store payment intent if needed
      } else {
        // Payment not yet completed, handle as necessary
        console.log("Payment not yet completed:", result);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };
  
  




  return (
    <>
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
            <button ref={btnRef} onClick={handleClick}>
              Submit
            </button>
          </div>
        )}
        {successVisible && (
          <div className="success">Payment succeeded! {paymentIntent}</div>
        )}
      </div>
      <div className="bottom-btn-container">
        <Link to="/" className="big-btn-red">
          Back
        </Link>
        <Link to="/checkout" className="big-btn-blue">
        Will do something eventually
        </Link>
      </div>
    </>
  );
};

export default DepositForm;