import { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import supabase from './App/supabaseConfig';


export default function Balance() {
  const { userBalance, userInTable } = useContext(AuthContext);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [error, setError] = useState("");

  const fetchUserBalance = async (userInTable) => {
    if (userInTable) {
      const { data, error } = await supabase
        .from('balances')
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
  }, [userBalance, userInTable]);

  const onRefreshBalance = async (event) => {
    event.preventDefault();
    setError("");
    setCurrentBalance(null);
    fetchUserBalance(userInTable);
  };

  return (
    <>
      <div className="balance-container">
        <div>
          <h2>Balance</h2>
          {/* TODO: Fix USD conversion dynamically based on sirch to dollar conv. */}
          <h4 className="balance-box">You&apos;ve got <span className="bold-coin green-coin">ⓢ{currentBalance}</span> / ${(currentBalance*0.10).toFixed(2)}</h4>
        </div>
        <div>
          <button className="balance-btn" onClick={onRefreshBalance}>Refresh Balance</button>
        </div>
        {error && <p className="text-danger">{error}</p>}
        <div className="bottom-btn-container">
          <Link to="/" className="big-btn-red">
            Back
          </Link>
          <Link to="/purchase" className="big-btn-blue">
            Buy More
          </Link>
        </div>
      </div>
    </>
  );
}