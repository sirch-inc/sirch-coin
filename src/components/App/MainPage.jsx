import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";


export default function MainPage() {
  const { session, userInTable } = useContext(AuthContext);

  return (
    <div className="mainpage">
      
      {session ? (
        <div className="button-container">

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
        ) : (
        <div className="button-container">
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