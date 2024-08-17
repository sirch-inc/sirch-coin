import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App";
import "./components/App/App.css";


const root = ReactDOM.createRoot(document.getElementById("root"));

if (import.meta.env.MODE === 'production')
{
  alert("PRE-ALPHA WARNING:\n\nThis is the pre-alpha public production Sirch Coin site.\n\n\
Transactions are real and recorded.\n\n\
You must use real credit cards for purchases at this time, which will be processed and debited.\n\n\
If you require additional support or adjustments to your balance or transaction history, contact us."
);
}

document.title = import.meta.env.VITE_PAGE_TITLE;

root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);