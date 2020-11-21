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
  IonBackButton,
  IonLabel,
  IonToggle,
} from "@ionic/react";
import { chevronForwardOutline } from "ionicons/icons";
import { request_put, request } from "../auth_fetch/index";
import { useAuth0 } from "@auth0/auth0-react";

const Setting = () => {
  const [notiTime, setNotiTime] = useState(null);
  const [date, setDate] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [userNoti, setUserNoti] = useState(null);
  const [notiTimeChenged, setNotiTimeChanged] = useState(1);
  const [notiDateChenged, setNotiDateChanged] = useState(1);
  const [preNotiTime, setPreNotiTime] = useState("20:00");
  const [preNotiDate, setPreNotiDate] = useState("pre");
  const [checked, setChecked] = useState(1);

  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  useIonViewWillEnter(() => {
    request(
      `${process.env.REACT_APP_API_ENDPOINT}/get_user_notification`,
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
      getAccessTokenSilently,
      data
    );
    setShowAlert(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton slot="start" defaultHref="/setting" />
          <IonTitle>通知</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {" "}
          <IonItem
            _ngcontent-mvh-c79=""
            lines="full"
            class="item md item-lines-full in-list ion-focusable item-label hydrated ion-untouched ion-pristine ion-valid"
          >
            <IonLabel
              _ngcontent-mvh-c79=""
              class="sc-ion-label-md-h sc-ion-label-md-s md hydrated"
              id="ion-tg-0-lbl"
            >
              {" "}
              通知をオンにする{" "}
            </IonLabel>
            <IonToggle
              checked={checked}
              onIonChange={(e) => setChecked(e.detail.checked)}
            />
          </IonItem>
        </IonList>
        <IonItem>
          <IonSelect
            value={notiDateChenged == 1 ? preNotiDate : date}
            onIonChange={(e) => {
              setNotiDateChanged(0);
              setDate(e.detail.value);
            }}
          >
            <IonSelectOption value="pre">前日</IonSelectOption>
            <IonSelectOption value="on">当日</IonSelectOption>
          </IonSelect>
          &emsp;
          <IonDatetime
            displayFormat="HH:mm"
            value={notiTimeChenged == 1 ? preNotiTime : notiTime}
            //minuteValues="0,15,30,45"
            onIonChange={(e) => {
              setNotiTimeChanged(0);
              setNotiTime(e.detail.value);
            }}
          ></IonDatetime>
          <IonButton
            slot="end"
            color="dark"
            onClick={() => {
              sendData();
            }}
          >
            変更する
          </IonButton>
        </IonItem>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="my-custom-class"
          header={"変更しました"}
          buttons={["OK"]}
        />
        {/*<IonItem>
          <IonSelect
            value={notiDateChenged == 1 ? preNotiDate : date}
            onIonChange={(e) => {
              setNotiDateChanged(0);
              setDate(e.detail.value);
            }}
          >
            <IonSelectOption value="pre">前日</IonSelectOption>
            <IonSelectOption value="on">当日</IonSelectOption>
          </IonSelect>
          &emsp;
          <IonDatetime
            displayFormat="HH:mm"
            value={notiTimeChenged == 1 ? preNotiTime : notiTime}
            //minuteValues="0,15,30,45"
            onIonChange={(e) => {
              setNotiTimeChanged(0);
              setNotiTime(e.detail.value);
            }}
          ></IonDatetime>
          <IonButton
            slot="end"
            color="dark"
            onClick={() => {
              sendData();
            }}
          >
            追加する
          </IonButton>
        </IonItem>*/}
      </IonContent>
    </IonPage>
  );
};

export default Setting;
