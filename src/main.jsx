import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App";
import "./components/App/App.css";


const root = ReactDOM.createRoot(document.getElementById("root"));

if (import.meta.env.MODE === 'production')
{
  alert("PRELAUCH WARNING:\n\nThis is the public production Sirch Coin site.\n\n\
This environment is currently still using the TEST version of the backend (and DB).\n\nUse TEST credit-cards for purchases.");  
}

document.title = import.meta.env.VITE_PAGE_TITLE;

root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);