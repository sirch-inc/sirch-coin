import { Link } from "react-router-dom";

export default function MainPage() {
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
