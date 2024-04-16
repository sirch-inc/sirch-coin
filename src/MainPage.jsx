import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function MainPage() {

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  console.log(isAuthenticated, user)


  return (
    <>
      <h3 className="page-header">Avaliable Transactions</h3>
      <div className="button-container">
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
    </>
  );
}
