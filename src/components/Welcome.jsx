import { Link } from "react-router-dom";


// TODO: handle errors here (esp 400-class, like "expired link", etc...)
// TODO: address the user by user name, if that is accessible?
export default function Welcome() {
    return(
        <>
            <h1>Welcome!</h1>
            <h4>Your SirchCoins account has been created and you may now use all of the SirchCoin services!</h4>
            <div className="button-container">
              <Link to="/" className="action-btn">
                Get Started!
              </Link>
            </div>
        </>
    )
}