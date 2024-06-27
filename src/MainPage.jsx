import { Link } from "react-router-dom";
import { AuthContext } from "./components/AuthContext";
import { useContext } from "react";


export default function MainPage() {
  const { session, userInTable } = useContext(AuthContext);

  // TODO: this is a hack; the "admin" view(s) should be conditionally compiled out of the app in PROD
  const env = import.meta.env.VITE_ENVIRONMENT;
  const isLocalEnvironment = env && env.toLowerCase() === 'local';

  return (
    <>
      {session && userInTable ? (
        <h3 className="page-header">Welcome, {userInTable.name}!</h3>
      ) : (
        <h3 className="page-header"> Welcome! Please sign in to use Sirch Coins.</h3>
      )}
      
      {session ? (
        <div className="button-container">
          {isLocalEnvironment &&
          <Link to="admin/faucet" className="action-btn">
              Admin: Faucet
          </Link>
          }

          <Link to="purchase" className="action-btn">
            Purchase Sirch Coins
          </Link>

          <Link to="coin/send" className="action-btn">
            Send Sirch Coins
          </Link>

          <Link to="coin/balance" className="action-btn">
            Balance Inquiry
          </Link>

          <Link to="/transfers" className="action-btn">
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
        <div className="button-container">
          <Link to="help" className="action-btn">
            Help
          </Link>
        </div>
        )}
    </>
  );
}