import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonCard,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonButton,
  IonAlert,
  IonIcon,
  useIonViewWillEnter,
  IonList,
  IonListHeader,
} from "@ionic/react";
import { chevronForwardOutline, push } from "ionicons/icons";
import { request_put, request } from "../auth_fetch/index";
import { useAuth0 } from "@auth0/auth0-react";

const Setting = ({ history }) => {
  const [notiTime, setNotiTime] = useState(null);
  const [date, setDate] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [userNoti, setUserNoti] = useState(null);
  const [notiTimeChenged, setNotiTimeChanged] = useState(1);
  const [notiDateChenged, setNotiDateChanged] = useState(1);
  const [preNotiTime, setPreNotiTime] = useState("20:00");
  const [preNotiDate, setPreNotiDate] = useState("pre");

  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    getAccessTokenWithPopup,
  } = useAuth0();

  useIonViewWillEnter(() => {
    request(
      `${process.env.REACT_APP_API_ENDPOINT}/get_user_notification`,
      getAccessTokenWithPopup
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

  const sendData = () => {
    if (date == null && notiTime == null) {
      return;
    }
    const data = {
      date: date,
      time: notiTime,
    };
    request_put(
      `${process.env.REACT_APP_API_ENDPOINT}/change_notification`,
      getAccessTokenWithPopup,
      data
    );
    setShowAlert(true);
  };

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

        <IonItem>
          カラー
          <IonButton color="dark" fill="fill" slot="end">
            <IonIcon icon={chevronForwardOutline}></IonIcon>
          </IonButton>
        </IonItem>

        <IonList>
          <IonItem lines="none"></IonItem>
          <IonButton
            color="dark"
            expand="full"
            fill="outline"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Log out
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Setting;
