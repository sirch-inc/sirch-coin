import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./Users/AuthContext";
import { Link } from "react-router-dom";
import supabase from "../Config/supabaseConfig";

export default function SendCoin() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [sendAmount, setSendAmount] = useState(0);
  const { userInTable, session, userBalance } = useContext(AuthContext);
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    if (session && session.user) {
      setRecipientEmail(session.user.email);
    }
  }, [session]);

  const handleCoinInputChange = (event) => {
    setSendAmount(parseInt(event.target.value, 10));
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
        // Start a transaction
        const { error: transactionError } = await supabase.transaction(
          async (tx) => {
            // Update the sender's balance
            const { error: senderUpdateError } = await tx
              .from("user-balances")
              .update({ balance: userBalance.balance - sendAmount })
              .eq("user_id", userInTable.user_id)
              .select("balance")
              .single();

            if (senderUpdateError) {
              throw new Error("Error updating sender's balance");
            }

            // Update the recipient's balance
            const { error: recipientUpdateError } = await tx
              .from("user-balances")
              .update({ balance: recipientData.balance + sendAmount })
              .eq("user_id", recipientData.user_id)
              .select("balance")
              .single();

            if (recipientUpdateError) {
              throw new Error("Error updating recipient's balance");
            }

            // Insert a new transaction record
            const { error: transactionInsertError } = await tx
              .from("transactions")
              .insert({
                sender_id: userInTable.user_id,
                receiver_id: recipientData.user_id,
                amount: sendAmount,
              });

            if (transactionInsertError) {
              throw new Error("Error inserting transaction record");
            }
          }
        );

        if (transactionError) {
          console.error("Error during transaction:", transactionError);
        } else {
          console.log("Transaction successful!");
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