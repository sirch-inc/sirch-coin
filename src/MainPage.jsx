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
          <Link to="admin/faucet" className="action-btn">
              Admin: Faucet
          </Link>

          <Link to="checkout" className="action-btn">
            Purchase Sirch Coins
          </Link>

          <Link to="coin/send" className="action-btn">
            Send Sirch Coins
          </Link>

          <Link to="coin/balance" className="action-btn">
            Balance Inquiry
          </Link>

          <Link to="/transactions" className="action-btn">
            Transactions
          </Link>

          <Link to="preferences" className="action-btn">
            Preferences
          </Link>

          <Link to="help" className="action-btn">
            Help
          </Link>
        </div>
        ) : (
          <div className="button-container">
            <Link to="help" className="action-btn">
              Help
            </Link>
          </div>
        )}
      {/* TODO: <ToastContainer /> */}
    </>
  );
}