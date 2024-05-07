import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import "./App.css";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_OAUTH_DOMAIN}
      clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
      authorizationParams={{
      redirect_uri: window.location.origin,
      audience: process.env.REACT_APP_OAUTH_AUDIENCE,
      scope: "read:current_user update:current_user_metadata",
    }}
    onRedirectCallback={(state) => {
      console.log('onRedirectCallback', state);
    }}
  >
    <App />
  </Auth0Provider>,
  </React.StrictMode>
);
