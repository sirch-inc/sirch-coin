import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import supabase from '../Config/supabaseConfig';


const CoinBalance = () => {
  const { userBalance, userInTable } = useContext(AuthContext);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [error, setError] = useState("");

  const fetchUserBalance = async (userInTable) => {
    if (userInTable) {
      const { data, error } = await supabase
        .from('user-balances')
        .select("*")
        .eq('user_id', userInTable.user_id)
        .single();

      if (error) {
        // TODO: handle error
        alert('Error fetching user balance:', error);
      } else {
        // TODO: handle NULL or otherwise malformed balances
        setCurrentBalance(data.balance);
      }
    } else {
      // TODO: handle no userInTable
      alert('User not found');
    }
  };

  useEffect(() => {
    // (Re)fetch the user's balance when the component mounts
    fetchUserBalance(userInTable);
  }, [userBalance]);

  const onRefreshBalance = async (event) => {
    event.preventDefault();
    setError("");
    fetchUserBalance(userInTable);
  };

  let currentBalanceString = currentBalance !== null
    ?  currentBalance + " Sirch Coins"
    :  "Loading...";

  return (
    <>
      <h3 className="page-header">Balance Inquiry</h3>
      <div className="balance-container">
        <div>
          <h2>You currently have a balance of:</h2>
          <h4>{currentBalanceString}</h4>
        </div>
        <div>
          <button className="balance-btn" onClick={onRefreshBalance}>Refresh Balance</button>
        </div>
        {error && <p className="text-danger">{error}</p>}
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

export default CoinBalance;