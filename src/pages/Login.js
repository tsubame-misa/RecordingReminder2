import React, { useEffect, useState } from "react";
import {
  IonHeader,
  IonLoading,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButton,
  IonFooter,
} from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import icon from "./img/icon_white_circle.png";

const Login = () => {
  const { isLoading, loginWithRedirect } = useAuth0();

  return (
    <IonPage>
      <IonContent color="dark">
        <div className="display-flex">
          <img
            src={icon}
            className="my-4 text-center object-contain h-48 w-full"
          ></img>
          <div className="text-center text-xl  m-1">
            <p>「Re」cording「Re」minder</p>
            <p>録画予約を忘れない</p>
          </div>
          <IonButton fill="clear" size="large" onClick={loginWithRedirect}>
            ログイン
          </IonButton>
        </div>
        <IonLoading isOpen={isLoading} />
      </IonContent>
    </IonPage>
  );
};

export default Login;
