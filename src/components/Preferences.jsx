import React from "react";
import { Link } from "react-router-dom";

export default function Preferences () {
  return (
    <>
      <h3 className="page-header">Preferences.</h3>
      <div className="balance-container">
        <p className="page-text">
          Sorry, there are no preferences, Sirch Coins are simple.
        </p>
        <p className="page-text">
          <strong>Have a nice day</strong>
        </p>
        <div className="bottom-btn-container">
          <Link to="/" className="big-btn-red">
            Back
          </Link>
          <Link to="https://twitter.com/compose/tweet" className="big-btn-blue">
            Tweet This
          </Link>
        </div>
      </div>
    </>
  );
}
