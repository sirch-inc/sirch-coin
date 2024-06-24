import React from "react";
import { Link } from "react-router-dom";


export default function Transactions() {
  return (
    <>
      <h3 className="page-header">Transaction History</h3>
      <div className="balance-container">
        <p className="page-text">
          Your transactions:
        </p>
        
        <div className="bottom-btn-container">
          <Link to="/" className="big-btn-red">
            Back
          </Link>
        </div>
      </div>
    </>
  );
}
