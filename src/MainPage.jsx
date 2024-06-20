import { Link } from "react-router-dom";
import { AuthContext } from "./components/AuthContext";
import { useEffect, useContext } from "react";
import supabase from "./Config/supabaseConfig"


export default function MainPage() {
  const { session, userInTable } = useContext(AuthContext);

  return (
    <>
      {session && userInTable ? (
        <h3 className="page-header">Welcome, {userInTable.name}!</h3>
      ) : (
        <h3 className="page-header"> Welcome! Please sign in to use Sirch Coins.</h3>
      )}
      
      {session ? (
        <div className="button-container">
          <Link to="/coin-faucet" className="action-btn">
              Internal: Balance & Faucet
          </Link>

          <Link to="coin/send" className="action-btn">
            Send Money
          </Link>

          <Link to="checkout" className="action-btn">
            Deposit
          </Link>

          <Link to="coin/balance" className="action-btn">
            Balance Inquiry
          </Link>

          <Link to="/transferhistory" className="action-btn">
            Transfer History
          </Link>

          <Link to="preferences" className="action-btn">
            Preferences
          </Link>

          <Link to="help" className="action-btn">
            Help
          </Link>
        </div>
        ) : (
          <Link to="help" className="action-btn">
          Help
          </Link>
        )}
      {/* <ToastContainer /> */}
    </>
  );
}