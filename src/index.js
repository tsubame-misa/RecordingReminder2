import React from "react";
//import { render } from "@testing-library/react";
import { render } from "react-dom";
import App from "./App";
//import { useAuth0 } from "@auth0/auth0-react";

//render(<App />, document.getElementById("root"));

import { Auth0Provider } from "@auth0/auth0-react";

render(
  <Auth0Provider
    //clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    clientId="QksDNvEBMWUoxDbYvwr3hRysF1vK6B2P" //vdslab capacitor
    audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    domain="auth.vdslab.jp"
    //clientId="94VKGJS7zzIa7O60yuIr8ZOF6BBYxZ6M" //--deve
    //clientId="EaBrlqXcQ3rTVU8t9CHQEF9xvwxxHhmF" // --capacitor
    //clientId="wP5F8AixdnU86cNxbWmrmBnLwjSFefXh"
    //audience="https://blooming-coast-85852.herokuapp.com"
    //domain="recording-reminder.us.auth0.com"
    redirectUri={window.location.origin}
    useRefreshTokens
    cacheLocation="localstorage"
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);
/*
render(
  <Auth0Provider
    domain="auth0-react-test.us.auth0.com"
    clientId="bz5xhba5hV2arCSNnSlulrypuPHgTRyd"
    redirectUri={window.location.origin}
    audience="https://musicvis"
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);
*/
