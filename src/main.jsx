import React from "react";
import ReactDOM from "react-dom/client";
import "./components/App/App.css";
// #v-ifdef IS_COMING_SOON
import ComingSoonApp from "./components/App/ComingSoonApp";
// #v-else
import App from "./components/App/App";
// #v-endif


document.title = import.meta.env.VITE_PAGE_TITLE;

const root = ReactDOM.createRoot(document.getElementById("root"));

// #v-ifdef IS_COMING_SOON

root.render(
  <React.StrictMode>
    <ComingSoonApp/>
  </React.StrictMode>
);

// #v-else

root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);

// #v-endif