import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function MainPage() {

  const { getAccessTokenSilently, isAuthenticated, user, isLoading } = useAuth0();

  const callApi = async () => {

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch("dev-rzyub0shb85bv728.us.auth0.com/", {
        method: "POST",  
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const responseData = await response.json();
      console.log(responseData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    callApi();
  }, [isAuthenticated, isLoading]);



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
