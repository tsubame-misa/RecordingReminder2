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
} from "@ionic/react";
import { chevronForwardOutline } from "ionicons/icons";

const Setting = () => {
  const [notiTime, setNotiTime] = useState(null);
  const [date, setDate] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [userNoti, setUserNoti] = useState(null);
  const [notiTimeChenged, setNotiTimeChanged] = useState(1);
  const [notiDateChenged, setNotiDateChanged] = useState(1);
  const [preNotiTime, setPreNotiTime] = useState("20:00");
  const [preNotiDate, setPreNotiDate] = useState("pre");

  useIonViewWillEnter(() => {
    window
      .fetch(`http://localhost:8080/get_user_notification`)
      .then((response) => response.json())
      .then((data) => {
        setUserNoti(data);
      });
  }, []);
  //console.log(userNoti);

  useEffect(() => {
    if (userNoti !== null) {
      const notiList = userNoti.split(/[/:]/);
      //console.log(notiList);
      setPreNotiTime(notiList[1] + ":" + notiList[2]);
      setPreNotiDate(notiList[0]);
    }
  });
  //console.log(notiTime);

  const sendData = () => {
    if (date == null && notiTime == null) {
      return;
    }
    const data = {
      date: date,
      time: notiTime,
    };
    window.fetch(`http://localhost:8080/change_notification`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    setShowAlert(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Setting</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonItem lines="none" color="light">
            通知
          </IonItem>
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
        </IonCard>
        <IonItem>
          カラー
          <IonButton
            //href="/user/color_setting"
            color="dark"
            fill="fill"
            slot="end"
          >
            <IonIcon icon={chevronForwardOutline}></IonIcon>
          </IonButton>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Setting;
