import React, { useState } from "react";
import { Link } from "react-router-dom";


export default function StripeSuccess() {
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h1 style={{ color: "green" }}>Payment Successful!</h1>
          <p style={{ color: "black" }}>Thank you for your purchase.</p>
          <p style={{ color: "black" }}>Your transaction with stripe has been completed successfully.</p>
          <Link to="/" style={{ textDecoration: "none", color: "blue" }}>
        Back to Home
      </Link>
    </div>
  );
};