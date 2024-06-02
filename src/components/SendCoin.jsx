import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom";
import supabase from "../Config/supabaseConfig";

export default function SendCoin() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [sendAmount, setSendAmount] = useState("Other Amount");
  const { userInTable, session, userBalance } = useContext(AuthContext);
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    if (session && session.user) {
      setRecipientEmail("Recipient Email");
    }
  }, [session]);

  const handleCoinInputChange = (event) => {
    const value = event.target.value;
    if (value === "") {
      setSendAmount("Other Amount");
    } else {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue)) {
        setSendAmount(parsedValue);
      }
    }
  };

  const handleAmountButtonClick = (amount) => {
    setSendAmount(amount);
  };

  const handleRecipientEmailChange = (event) => {
    setRecipientEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Find the recipient user by email
      const { data: recipientData, error: recipientError } = await supabase
        .from("users")
        .select("*")
        .eq("email", recipientEmail)
        .single();

      if (recipientError) {
        console.error("Error fetching recipient:", recipientError);
        return;
      }

      setRecipient(recipientData);

      // Check if the logged-in user has enough balance
      if (userBalance.balance >= sendAmount) {
        // Call the RPC function to handle the coin transfer
        const { data, error } = await supabase.rpc("transfer_coins", {
          sender_id: userInTable.user_id,
          receiver_id: recipientData.user_id,
          amount: sendAmount,
        });

        if (error) {
          console.error("Error during coin transfer:", error);
        } else {
          console.log("Coin transfer successful!");
          setSendAmount(0);
          setRecipientEmail("");
        }
      } else {
        console.error("Insufficient balance");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="send-coin-container">
      <div>
        <h3 className="page-header">Send Sirch Coins</h3>
        <p className="page-text">Sending is super easy. Do it now.</p>
        <form onSubmit={handleSubmit}>
          <div className="price-container">
            <div className="cash-buttons">
              <div className="first-row">
                <button
                  className="cash1-btn"
                  onClick={() => handleAmountButtonClick(20)}
                >
                  $20
                </button>
                <button
                  className="cash1-btn"
                  onClick={() => handleAmountButtonClick(40)}
                >
                  $40
                </button>
                <button
                  className="cash1-btn"
                  onClick={() => handleAmountButtonClick(100)}
                >
                  $100
                </button>
              </div>
              <div className="second-row">
                <button
                  className="cash1-btn"
                  onClick={() => handleAmountButtonClick(500)}
                >
                  $500
                </button>
                <button
                  className="cash1-btn"
                  onClick={() => handleAmountButtonClick(1000)}
                >
                  $1000
                </button>
                <button
                  className="cash1-btn"
                  onClick={() => handleAmountButtonClick(239)}
                >
                  $239
                </button>
              </div>
            </div>

            <input
              placeholder="Other Amount"
              required
              type="text"
              name="coin"
              id="coin"
              className="cash1-input other-amount-input"
              value={sendAmount}
              onChange={handleCoinInputChange}
            />

            <div className="email-inputs">
              <input
                placeholder="Your Email"
                required
                type="email"
                name="userEmail"
                id="userEmail"
                className="cash1-input your-email-input"
                value={session?.user?.email || ""}
                readOnly
              />
              <input
                placeholder="Recipient's Email"
                required
                type="email"
                name="recipientEmail"
                id="recipientEmail"
                className="cash1-input recipient-email-input"
                value={recipientEmail}
                onChange={handleRecipientEmailChange}
                autoComplete="email"
              />
            </div>
          </div>
          <div className="bottom-btn-container">
            <Link to="/" className="big-btn-red">
              Back
            </Link>
            <button type="submit" className="send-btn big-btn-blue">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}