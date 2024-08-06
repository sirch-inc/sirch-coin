import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";
import LogoutSupabase from "../Account/Logout";

// eslint-disable-next-line react/prop-types
export default function MainPage({ supabase }) {
  const { session } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout(){
    LogoutSupabase({ supabase })
    navigate('/')
  }

  return (
    <div className="mainpage">
      {session ? (
        <>
          <div className="left-button-container">
            <Link to="account" className="action-btn">
              My Account
            </Link>

            <Link to="#" className="action-btn" onClick={handleLogout}>
              Log Out
            </Link>
          </div>

          <div className="right-button-container">

            <Link to="coin/send" className="action-btn">
              Send ⓢ
            </Link>


            <Link to="coin/balance" className="action-btn">
              Balance
            </Link>

            <Link to="/transactions" className="action-btn">
              History
            </Link>
            
            <Link to="purchase" className="action-btn">
              Buy ⓢ
            </Link>

            <Link to="help" className="action-btn">
              Help
            </Link>
          </div>

        </>
        ) : (
        <div className="login-button-container">
          <Link to="login" className="action-btn">
            Log in
          </Link>

          <Link to="create-account" className="action-btn">
            Sign up
          </Link>
        </div>
        )
      }
    </div>
  );
}