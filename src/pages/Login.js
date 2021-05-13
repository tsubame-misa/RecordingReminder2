import React from "react";
import { IonContent, IonPage, IonButton } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import icon from "./img/icon_white_circle.png";
import { Plugins } from "@capacitor/core";

const Login = () => {
  const {
    isLoading,
    buildAuthorizeUrl,
    handleRedirectCallback,
    getAccessTokenSilently,
  } = useAuth0();
  const { Browser, App } = Plugins;

  async function loginWithRedirect2(RedirectLoginOptions) {
    const authUrl = await buildAuthorizeUrl();
    console.log("in logWithRedirect2", authUrl);
    Browser.open({ url: authUrl });

    const listeners = App.addListener("appUrlOpen", (data) => {
      console.log("in listener");
      //this.zone.run(async () => {
      open();
      async function open() {
        try {
          listeners.remove();

          Browser.close();
          console.log("close Browser");
          const redirectUrl = new URL(data.url);
          console.log("redirectURl = ", redirectUrl);
          if (redirectUrl.pathname.match("")) {
            await handleRedirectCallback(data.url);
            await getAccessTokenSilently().toPromise();
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  return (
    <IonPage>
      <IonContent color="dark">
        <div className="display-flex">
          <img
            src={icon}
            className="my-4 text-center object-contain h-48 w-full"
            alt=""
          ></img>
          <div className="text-center text-xl  m-1">
            <p>「Re」cording「Re」minder</p>
            <p>録画予約を忘れない</p>
          </div>
          <IonButton fill="clear" size="large" onClick={loginWithRedirect2}>
            ログイン
          </IonButton>
        </div>
        {/*<IonLoading isOpen={isLoading} />*/}
      </IonContent>
    </IonPage>
  );
};

export default Login;
