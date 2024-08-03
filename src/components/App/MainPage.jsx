import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";


export default function MainPage() {
  const { session, userInTable } = useContext(AuthContext);

  return (
    <>
      {session && userInTable ? (
        <h3 className="page-header">Welcome, {userInTable.name}!</h3>
      ) : (
        <h3 className="page-header"> Welcome! Please sign in to use the Sirch Coins application.</h3>
      )}
      
      {session ? (
        <div className="button-container">
          <Link to="purchase" className="action-btn">
            Purchase Sirch Coins
          </Link>

          <Link to="coin/send" className="action-btn">
            Send Sirch Coins
          </Link>

          <Link to="coin/balance" className="action-btn">
            Balance Inquiry
          </Link>

          <Link to="/transactions" className="action-btn">
            Transaction History
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
        )
      }
    </>
  );
}