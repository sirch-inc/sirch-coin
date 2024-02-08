import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SendCoin() {
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [coin, setCoin] = useState(0);
  const [coinAmount, setCoinAmount] = useState("");


    // Function to handle changes in the coin input field
    const handleCoinInputChange = (event) => {
      setCoinAmount(event.target.value);
    };
  
    // Function to handle different cash amounts button clicks
    const handleAmountButtonClick = (amount) => {
      setCoinAmount(amount.toString()); // Assuming coinAmount should be a string
      setCoin(amount);
    };
  

  const emailChange = (event) => {
    setEmail(event.target.value);
  };
  const userEmailChange = (event) => {
    setUserEmail(event.target.value);
  };
  const coinChange = (event) => {
    setCoin(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {};

    data.recipientEmail = email;
    data.senderEmail = userEmail;
    data.numberOfCoins = coin;

    const sendUrl =
      "https://sirchcoinv1-production.up.railway.app/api/v1/customers/transfer-coins";

    const fetchConfig = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(sendUrl, fetchConfig);
      if (response.ok) {
        setEmail("");
        setUserEmail("");
        setCoin(0);
      } else {
        console.error(
          "Failed to send coins. Server responded with",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };


  

  return (
    <div className="send-coin-container">
      <div>
        <h3 className="page-header">Send Sirch Coins</h3>
        <p className="page-text">
        Sending is super easy. Do it now.</p>
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
              value={coinAmount}
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
                value={userEmail}
                onChange={userEmailChange}
                autoComplete="email"
              />
              <input
                placeholder="Recipient's Email"
                required
                type="email"
                name="email"
                id="recipientEmail"
                className="cash1-input recipient-email-input"
                value={email}
                onChange={emailChange}
                autoComplete="email"
              />
            </div>
          </div>
          <div className="bottom-btn-container">
            <Link to="/" className="big-btn-red">
              Back
            </Link>
            <button className="send-btn big-btn-blue">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}