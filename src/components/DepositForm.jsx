import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function DepositForm() {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [email, setEmail] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [totalUSD, setTotalUSD] = useState("Total USD");

  const handleAmountButtonClick = (amount) => {
    setSelectedAmount(amount);
    setCoinAmount(`${(amount / 0.1).toFixed(2)}`);
    setTotalUSD(`$${amount.toFixed(2)} USD`);
  };

  const emailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleCoinInputChange = (event) => {
    setCoinAmount(event.target.value);
    setSelectedAmount((event.target.value * 0.1).toFixed(2));
    setTotalUSD((event.target.value * 0.1).toFixed(2));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      email: email,
      numberOfCoins: coinAmount,
      selectedAmount: selectedAmount,
    };

    try {
      const intializePaymentUrl =
        "https://sirchcoinv1-production.up.railway.app/api/v1/payments/initialize-payment";
      const fetchConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(intializePaymentUrl, fetchConfig);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setEmail("");
      setCoinAmount(0);
      setTotalUSD("Total USD");
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  return (
    <>
      <h3 className="page-header">Buy Sirch Coins</h3>
      <div className="buy-container">
        <p className="page-text">
          Please enter an amount in USD that you'd like to spend buying Sirch
          Coins, and then press <strong>Buy</strong>.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="price-container">
            <div className="first-row">
              <button
                className="cash-btn"
                onClick={() => handleAmountButtonClick(20)}
              >
                $20
              </button>
              <button
                className="cash-btn"
                onClick={() => handleAmountButtonClick(40)}
              >
                $40
              </button>
              <button
                className="cash-btn"
                onClick={() => handleAmountButtonClick(100)}
              >
                $100
              </button>
              <input
                placeholder="Amount of Coin"
                required
                type="text"
                name="coin"
                id="coin"
                className="cash-input"
                value={coinAmount}
                onChange={handleCoinInputChange}
              />
            </div>
            <div className="second-row">
              <button
                className="cash-btn"
                onClick={() => handleAmountButtonClick(1000)}
              >
                $1000
              </button>
              <button
                className="cash-btn"
                onClick={() => handleAmountButtonClick(500)}
              >
                $500
              </button>
              <button
                className="cash-btn"
                onClick={() => handleAmountButtonClick(239)}
              >
                $239
              </button>
              <input
                placeholder="Your Email"
                required
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                value={email}
                onChange={emailChange}
                className="cash-input"
              />
            </div>
            <input
              placeholder="Total USD"
              readOnly
              type="text"
              name="totalUSD"
              id="totalUSD"
              className="total-input"
              value={totalUSD}
              onChange={handleCoinInputChange}
            />
          </div>
          <div className="bottom-btn-container">
            <Link to="/" className="big-btn-red">
              Back
            </Link>
            <button type="submit" className="big-btn-blue">
              Buy
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
