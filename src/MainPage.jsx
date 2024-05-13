import { Link } from "react-router-dom";
import { AuthContext } from "./components/Users/AuthContext";
import { useEffect, useContext } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode"


export default function MainPage({supabase}) {

  // const { getAccessTokenSilently, isAuthenticated, user, isLoading } = useAuth0();

  // const callApi = async () => {

  //   try {
  //     const token = await getAccessTokenSilently();
  //     const response = await fetch("https://backend.sirch-engine.org/api/user", {  
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     const responseData = await response.json();
  //     console.log(responseData);
  //     console.log(user);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // useEffect(() => {
  //   callApi();
  // }, [isAuthenticated, isLoading]);

  const { userInTable } = useContext(AuthContext);

  return (
    <>
        {userInTable ? (
          <h3 className="page-header">Welcome, {userInTable.name}!</h3>
        ) : (
          <h3 className="page-header"> Welcome! Please sign in to use Sirch Coins.</h3>)}
      
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
    </>
  );
}
