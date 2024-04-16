import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_DOMAIN}
      clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
      authorizationParams={{
      redirect_uri: "http://localhost:3000",
      audience:process.env.REACT_APP_AUDIENCE,
      access_token: process.env.REACT_APP_ACCESS_TOKEN,
    }}
    onRedirectCallback={(state) => {
      console.log('onRedirectCallback', state);
    }}
  >
    <App />
  </Auth0Provider>,
  </React.StrictMode>
);
