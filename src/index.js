import React from "react";
//import { render } from "@testing-library/react";
import { render } from "react-dom";
import App from "./App";

//render(<App />, document.getElementById("root"));

import { Auth0Provider } from "@auth0/auth0-react";

render(
  <Auth0Provider
    domain="recording-reminder.us.auth0.com"
    clientId="rVpX2fcYShj3iDRseiAHeNQoIPZWSVct"
    redirectUri={window.location.origin}
    audience="https://rere"
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
