import React, { useState, useRef, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import supabase from "../Config/supabaseConfig";


export default function Purchase() {
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [containerVisible, setContainerVisible] = useState(true);
  const [successVisible, setSuccessVisible] = useState(false);
  const [amount, setAmount] = useState(0);
  const paymentElementRef = useRef(null);
  const btnRef = useRef(null);
  const { userInTable, session, userBalance } = useContext(AuthContext);

  const initializeStripe = async () => {
    const stripeKey = "pk_test_6rOaG7p9vtW2VyduXtVfr7JV00sqg9HpxQ";
    const stripe = await loadStripe(stripeKey);
    setStripe(stripe);

    const { data: clientSecret, error } = await supabase.rpc("create_payment_intent", {
      amount: amount * 100, // TODO: Convert to cents
    });

    if (error) {
      // TODO: surface this error
      console.error("Error creating payment intent:", error);
      return;
    }

    const elements = stripe.elements({ clientSecret });
    setElements(elements);

    const paymentElement = elements.create("payment", {
      layout: "tabs",
    });

    paymentElement.mount(paymentElementRef.current);
  };

  const handleClick = async () => {
    try {
      if (!stripe) {
        await initializeStripe();
        return;
      }

      // Confirm the payment
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/stripe/Success",
        },
      });

      // Check if the payment was successful
      if (result.error) {
        // TODO: surface this error...
        console.error("Payment failed:", result.error);
        window.location.href = window.location.origin + "/stripe/Failure";
      } else if (
        result.paymentIntent &&
        result.paymentIntent.status === "succeeded"
      ) {
        // Payment succeeded
        setContainerVisible(false); // Hide the payment form
        setSuccessVisible(true); // Show success message
        setPaymentIntent(result.paymentIntent.id); // Store payment intent if needed

        // Update user's balance and total supply
        const { data, error } = await supabase.rpc("purchase_coins", {
          user_id: userInTable.user_id,
          amount: amount,
        });

        if (error) {
          // TODO: surface this error
          console.error("Error updating balance and total supply:", error);
        } else {
          // TODO: surface this success
          console.log("Balance and total supply updated successfully!");
        }
      } else {
        // TODO: Payment not yet completed, handle as necessary
        console.log("Payment not yet completed:", result);
      }
    } catch (error) {
      // TODO: surface or handle this error
      console.error("Error processing payment:", error);
    }
  };

  return (
    <>
      <div>
        {containerVisible && (
          <div>
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
          <div className="success">Payment succeeded!{paymentIntent}</div>
        )}
      </div>
      <div className="bottom-btn-container">
        <Link to="/" className="big-btn-red">
          Back
        </Link>
        <Link to="/purchase" className="big-btn-blue">
          Will do something eventually
        </Link>
      </div>
    </>
  );
};