import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App";
import "./components/App/App.css";


const root = ReactDOM.createRoot(document.getElementById("root"));

document.title = import.meta.env.VITE_PAGE_TITLE;

root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);