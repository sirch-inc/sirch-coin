import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

// TODO: handle errors here (esp 400-class, like "expired link", etc...)
export default function Welcome() {
  const { session, userInTable } = useContext(AuthContext);

    return(
        <>
          {session && userInTable ? 
            <h1>Welcome {userInTable?.name}!</h1> : <> </> }
            <h4>Your SirchCoins account has been created and you may now use all of the SirchCoin services!</h4>
            <div className="button-container">
              <Link to="/" className="action-btn">
                Get Started!
              </Link>
            </div>
        </>
    )
}