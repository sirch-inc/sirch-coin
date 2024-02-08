import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CoinBalance() {
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");

  const emailChange = (event) => {
    setEmail(event.target.value);
  };

  const fetchBalance = async (event) => {
    event.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required to fetch the balance.");
      return;
    }

    const fetchUrl = `https://sirchcoinv1-production.up.railway.app/api/v1/customers/balance?email=${email}`;
    const fetchConfig = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(fetchUrl, fetchConfig);
      if (response.ok) {
        const result = await response.json();
        setBalance(result.coinBalance);
      } else {
        const errorMessage = "Invalid Email";
        setError(errorMessage);
      }
    } catch (error) {
      setError(`An error occurred: ${error.message}`);
    }
  };

  return (
    <>
      <h3 className="page-header">Balance Inquiry</h3>
      <div className="balance-container">
        <p className="page-text">
          Review your balance information, then press <strong>Buy More</strong>{" "}
          when you are done.
        </p>
        <form onSubmit={fetchBalance}>
          <input
            placeholder="Enter your Email"
            required
            type="email"
            name="email"
            id="email"
            className="email-balance"
            value={email}
            onChange={emailChange}
            autoComplete="email"
          />
          <button className="balance-btn" type="submit">
            Get Balance
          </button>
          {error && <p className="text-danger">{error}</p>}
          {balance !== null && (
            <h4 className="balance">${balance} Sirch Coins</h4>
          )}
        </form>
        <div className="bottom-btn-container">
          <Link to="/" className="big-btn-red">
            Back
          </Link>
          <Link to="/checkout" className="big-btn-blue">
            Buy More
          </Link>
        </div>
      </div>
    </>
  );
}
