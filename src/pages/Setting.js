import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  /*IonCard,
  IonSelect,
  IonSelectOption,
  IonDatetime,*/
  IonButton,
  // IonAlert,
  IonIcon,
  useIonViewWillEnter,
  IonList,
  // IonListHeader,
} from "@ionic/react";
import { chevronForwardOutline } from "ionicons/icons";
import { request } from "../auth_fetch/index";
import { useAuth0 } from "@auth0/auth0-react";
import { Plugins } from "@capacitor/core";

const Setting = ({ history }) => {
  const [userNoti, setUserNoti] = useState(null);
  /*const [notiTime, setNotiTime] = useState(null);
  const [date, setDate] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  //const [notiTimeChenged, setNotiTimeChanged] = useState(1);
  //const [notiDateChenged, setNotiDateChanged] = useState(1);*/
  const [preNotiTime, setPreNotiTime] = useState();
  const [preNotiDate, setPreNotiDate] = useState();
  const { Browser, App } = Plugins;
  const {
    logout,
    getAccessTokenSilently,
    buildLogoutUrl,
    //handleRedirectCallback,
    //isAuthenticated,
  } = useAuth0();

  useIonViewWillEnter(() => {
    request(
      "https://blooming-coast-85852.herokuapp.com/api/get_user_notification",
      //`${process.env.REACT_APP_API_ENDPOINT}/get_user_notification`,
      getAccessTokenSilently
    ).then((data) => {
      setUserNoti(data);
    });
  }, []);

  useEffect(() => {
    if (userNoti !== null && userNoti !== undefined) {
      const notiList = userNoti.split(/[/:]/);
      setPreNotiTime(notiList[1] + ":" + notiList[2]);
      setPreNotiDate(notiList[0]);
    }
  });

  async function logoutWithRedirect(RedirectLoginOptions) {
    //logout();
    const authUrl = await buildLogoutUrl();
    //console.log("in logoutWithRedirect");
    Browser.open({ url: authUrl });

    const listeners = App.addListener("appUrlOpen", (data) => {
      console.log("in listener");
      logout();
      open();
      async function open() {
        try {
          listeners.remove();

          Browser.close();
          //console.log("close Browser");
          const redirectUrl = new URL(data.url);
          //console.log("redirectURl = ", redirectUrl);
          if (redirectUrl.pathname.match("")) {
            //await handleRedirectCallback(data.url);
            await getAccessTokenSilently().toPromise();
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  /*const sendData = () => {
    if (date == null && notiTime == null) {
      return;
    }
    const data = {
      date: date,
      time: notiTime,
    };
    request_put(
      `${process.env.REACT_APP_API_ENDPOINT}/change_notification`,
      getAccessTokenSilently,
      data
    );
    setShowAlert(true);
  };*/

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>設定</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem
            _ngcontent-yfv-c79=""
            onClick={() => {
              history.push("/setting/notification");
            }}
            detail="false"
            target="_blank"
            class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
          >
            <ion-label>通知</ion-label>
            <IonIcon slot="end" icon={chevronForwardOutline}></IonIcon>
          </IonItem>
        </IonList>

        {/*<IonItem>
          カラー
          <IonButton color="dark" fill="fill" slot="end">
            <IonIcon icon={chevronForwardOutline}></IonIcon>
          </IonButton>
        </IonItem>*/}

        <IonList>
          <IonItem lines="none"></IonItem>
          {/*<IonButton
            color="dark"
            expand="full"
            fill="outline"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Log out
          </IonButton>*/}
          <IonButton
            color="dark"
            expand="full"
            fill="outline"
            onClick={() => logoutWithRedirect()}
          >
            Log out
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Setting;
