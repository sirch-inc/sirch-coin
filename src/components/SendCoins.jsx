import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom";
import supabase from "../Config/supabaseConfig";


export default function SendCoins() {
  const { userInTable, session, userBalance } = useContext(AuthContext);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState(null);
  
  // TODO: JEFF *******************************
  // useEffect(() => {
  //   if (session && session.user) {
  //     setRecipientEmail();
  //   }
  // }, [session]);

  const handleAmountButtonClick = (amount) => {
    setSendAmount(amount);
  };

  const handleCoinInputChange = (event) => {
    const value = event.target.value;
    
    // TODO: if the value is EQUAL to the user's balance, display a warning
    if (value < 0)
      setSendAmount("");
    else
      setSendAmount(value);
  };

  const handleRecipientEmailAddressChange = (event) => {
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
        alert("TODO: Recipient not found, so send invitation...")
      }

      setRecipient(recipientData);

      // recheck if the logged-in user has enough balance
      // TODO: this should all become an atomic transaction in the backend to ensure correctness
      if (sendAmount <= userBalance.balance) {
        // Call the RPC function to handle the coin transfer
        const { data, error } = await supabase.rpc("transfer_coins", {
          sender_id: userInTable.user_id,
          receiver_id: recipientData.user_id,
          amount: sendAmount
        });

        if (error) {
          // TODO: surface this error
          console.error("Error during coin transfer:", error);
        } else {
          console.log("Coin transfer successful!");
          setSendAmount("");
          setRecipientEmail("");
        }
      } else {
        // TODO: surface this error
        console.error("Insufficient balance");
      }
    } catch (error) {
      // TODO: surface this error
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="send-coin-container">
      <div>
        <h3 className="page-header">Send Sirch Coins</h3>
        <p className="page-text">
          To send Sirch Coins to anyone, please specify the amount and the recipient's email address below.
          We will send the recipient an email to claim their Sirch Coins.  If the recipient is not already
          registered with Sirch Coins, an invitation to join will also be included.
        </p>
        <p> You currently have a balance of: {userBalance?.balance || "UNKNOWN"} Sirch Coins.</p>
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
                  onClick={() => handleAmountButtonClick("")}
                >
                  Other Amount
                </button>
              </div>
            </div>

            <label htmlFor="amountToSend">Amount to Send</label>
            <input
              placeholder="any positive value up your balance"
              required
              type="number"
              min="0"
              max={userBalance?.balance || "0"}
              step=".01"
              name="amountToSend"
              id="amountToSend"
              className="cash1-input other-amount-input"
              value={sendAmount}
              onChange={handleCoinInputChange}
            />

            <div className="email-inputs">
              <label htmlFor="recipientEmailAddress">Recipient's Email Address</label>
              <input
                placeholder="any valid email address"
                required
                type="email"
                name="recipientEmailAddress"
                id="recipientEmailAddress"
                className="cash1-input recipient-email-input"
                value={recipientEmail}
                onChange={handleRecipientEmailAddressChange}
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