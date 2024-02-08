import React from "react";
import { Link } from "react-router-dom";

export default function Help() {
  return (
    <>
      <h3 className="page-header">Help</h3>
      <div className="balance-container">
        <p className="page-text">
        Sorry, this page isn't available yet
        </p>
        <p className="page-text">
          <strong>Please try again later</strong>
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
