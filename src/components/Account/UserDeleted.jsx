import { Link } from "react-router-dom";


export default function UserDeleted() {
  return(
    <>
      <h1>Your Sirch Coins account was successfully deleted.</h1>
      <h4>You may create a new account at any time.</h4>
      <div className="button-container">
        <Link to="/" className="action-btn">
          Got it!
        </Link>
      </div>
    </>
  )
}