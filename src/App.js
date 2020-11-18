import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, square, triangle } from "ionicons/icons";
import Future from "./pages/Future";
import Past from "./pages/Past";
import Setting from "./pages/Setting";
import Addprogram from "./add_tv_program/index";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

const App = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/future" component={Future} exact={true} />
          <Route path="/past" component={Past} exact={true} />
          {/*<Route path="/share" component={Share} exact={true} />*/}
          <Route path="/setting" component={Setting} />
          <Route path="/add_program" component={Addprogram} />
          <Route
            path="/"
            render={() => <Redirect to="/future" />}
            exact={true}
          />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="future" href="/future">
            <IonIcon icon={triangle} />
            <IonLabel>Future</IonLabel>
          </IonTabButton>
          <IonTabButton tab="past" href="/Past">
            <IonIcon icon={ellipse} />
            <IonLabel>Past</IonLabel>
          </IonTabButton>
          <IonTabButton tab="setting" href="/Setting">
            <IonIcon icon={square} />
            <IonLabel>Setting</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
