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
  IonFab,
  IonFabButton,
  IonContent,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  playCircleOutline,
  playBackCircleOutline,
  settings,
  add,
} from "ionicons/icons";
import Future from "./pages/Future";
import Past from "./pages/Past";
import Setting from "./pages/Setting";
import Addprogram from "./add_tv_program/index";
import Detail from "./pages/detail";

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
          <Route path="/setting" component={Setting} exact={true} />
          <Route path="/add_program" component={Addprogram} exact={true} />
          <Route
            path="/detail/:id/from_future"
            component={Detail}
            exact={true}
          />
          <Route path="/detail/:id/from_past" component={Detail} exact={true} />
          <Route
            path="/"
            render={() => <Redirect to="/future" />}
            exact={true}
          />
        </IonRouterOutlet>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton href="/add_program" color="dark">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonTabBar slot="bottom">
          <IonTabButton tab="future" href="/future">
            <IonIcon icon={playCircleOutline} />
            <IonLabel>Future</IonLabel>
          </IonTabButton>
          <IonTabButton tab="past" href="/past">
            <IonIcon icon={playBackCircleOutline} />
            <IonLabel>Past</IonLabel>
          </IonTabButton>
          <IonTabButton tab="setting" href="/setting">
            <IonIcon icon={settings} />
            <IonLabel>Setting</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
