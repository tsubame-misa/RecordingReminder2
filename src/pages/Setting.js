import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButton,
  IonToggle,
  IonList,
  IonSelect,
  IonAlert,
  IonSelectOption,
  useIonViewWillEnter,
  IonDatetime,
} from "@ionic/react";
import { chevronForwardOutline } from "ionicons/icons";
import { request_put, request } from "../auth_fetch/index";
import { useAuth0 } from "@auth0/auth0-react";
import { useStorage } from "@ionic/react-hooks/storage";
import notifications from "../notification/index";
import { CmpTime } from "../pages/Future";
import { Plugins } from "@capacitor/core";
//import Setteing from "../setting/noti_setting";

const Setting = () => {
  const [checked, setChecked] = useState();
  const { Browser, App } = Plugins;
  const { logout, buildLogoutUrl, getAccessTokenSilently } = useAuth0();
  const [notiTime, setNotiTime] = useState(null);
  const [date, setDate] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [notiTimeChenged, setNotiTimeChanged] = useState(1);
  const [notiDateChenged, setNotiDateChanged] = useState(1);
  const [preNotiTime, setPreNotiTime] = useState("20:00");
  const [preNotiDate, setPreNotiDate] = useState("pre");

  const TASKS_STORAGE = "tasks";
  const { get, set, remove } = useStorage();
  const [tasks2, setTask2] = useState([{ id: "19990909", min: 1 }]);

  useIonViewWillEnter(() => {
    request(
      "https://blooming-coast-85852.herokuapp.com/api/get_user_notification",
      //`${process.env.REACT_APP_API_ENDPOINT}/get_user_notification`,
      getAccessTokenSilently
    ).then((data) => {
      const data_list = data.split(/[/]/);
      setPreNotiDate(data_list[0]);
      setPreNotiTime(data_list[1]);
    });

    const getTasks = async () => {
      const tasksString = await get(TASKS_STORAGE);
      const taskData = tasksString ? JSON.parse(tasksString) : [];
      setTask2(taskData);
    };
    getTasks();

    /*const data = JSON.parse(localStorage.getItem("noti"));
    console.log(data);
    if (data === null) {
      setChecked(true);
      //localStorage.setItem("noti", false);
    }
    setChecked(data);*/
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("noti"));
    console.log(data);
    if (data === null) {
      setChecked(true);
      localStorage.setItem("noti", true);
    } else {
      setChecked(data);
    }

    console.log(checked);
  }, [checked]);

  async function logoutWithRedirect() {
    const authUrl = await buildLogoutUrl();
    Browser.open({ url: authUrl });

    const listeners = App.addListener("appUrlOpen", (data) => {
      console.log("in listener");
      logout();
      open();
      async function open() {
        try {
          listeners.remove();
          Browser.close();
          const redirectUrl = new URL(data.url);
          if (redirectUrl.pathname.match("")) {
            await getAccessTokenSilently().toPromise();
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  const sendData = () => {
    if (date == null && notiTime == null) {
      return;
    }
    const data = {
      date: date,
      time: notiTime,
    };
    request_put(
      "https://blooming-coast-85852.herokuapp.com/api/change_notification",
      //`${process.env.REACT_APP_API_ENDPOINT}/change_notification`,
      getAccessTokenSilently,
      data
    );
    changeNotiTime(data.date);
    setShowAlert(true);
  };

  const changeNotiTime = (d) => {
    console.log("通知する！！");

    //通知の前からある予約の秒数の再設定
    console.log(tasks2);
    notifications.stopLocalPush();
    for (let item of tasks2) {
      const obj = calcSecond(item.date, d);
      item.id = obj.id;
      item.min = obj.second;
      if (item.min > 0) {
        notifications.schedule(item);
      }
      //番組日時から二日以上すぎていたら通知候補リスト削除
      if (CmpTime(item.date) < -1 * 86400 * 2) {
        console.log(CmpTime(item.date) < 0);
        item.rm = true;
      }
    }
    const d2 = tasks2.filter((item) => item.rm !== true);
    remove(TASKS_STORAGE);
    setTask2(d2);
    set(TASKS_STORAGE, JSON.stringify(tasks2));
    console.log(tasks2);
  };

  const calcSecond = (b, notiDate) => {
    console.log(b);
    const dateList = b.split(/[-T:]/);
    const dateB = new Date(
      dateList[0],
      dateList[1] - 1,
      dateList[2],
      dateList[3],
      dateList[4],
      0,
      0
    ); //通知する 000* 60 * 60*24
    console.log("noti=", notiTime);
    console.log("prenoti", preNotiTime);
    let notiDateList = preNotiTime.split(/[-T:]/);
    if (notiTime !== null) {
      notiDateList = notiTime.split(/[-T:]/);
    }
    const current = new Date();
    let y = dateList[0],
      m = dateList[1] - 1,
      d = dateList[2];

    const id =
      String(y) + String(m + 1).padStart(2, "0") + String(d).padStart(2, "0");

    if (notiDate === "pre") {
      //一日引く
      const dateTime = dateB.getTime() - 1000 * 60 * 60 * 24;
      const newDate = new Date(dateTime);
      y = newDate.getFullYear();
      m = newDate.getMonth();
      d = newDate.getDate();
    }
    const date = new Date(y, m, d, notiDateList[0], notiDateList[1], 0, 0);

    //差分の秒数後に通知
    const diff = date.getTime() - current.getTime();
    const second = Math.floor(diff / 1000);
    return { id: id, second: second };
  };

  const setNotiData = () => {
    console.log(checked);
    if (checked !== undefined) {
      localStorage.setItem("noti", !checked);
    }
    if (!checked === false) {
      cancelNoti();
    } else if (!checked === true) {
      changeNotiTime(date);
    }
  };

  const cancelNoti = () => {
    notifications.stopLocalPush();
  };

  const checklNoti = () => {
    notifications.check();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="new">
          <IonTitle>設定</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <ion-label>通知</ion-label>
            <IonToggle
              checked={checked}
              onIonChange={(e) => {
                setChecked(e.detail.checked);
                setNotiData();
              }}
            />
          </IonItem>
        </IonList>

        {checked ? (
          <div>
            <IonItem>
              <IonSelect
                value={notiDateChenged === 1 ? preNotiDate : date}
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
                value={notiTimeChenged === 1 ? preNotiTime : notiTime}
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
          </div>
        ) : (
          []
        )}
        <IonItem>
          <IonButton
            slot="end"
            color="dark"
            onClick={() => {
              checklNoti();
            }}
          >
            予約数確認
          </IonButton>
        </IonItem>

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
          //color="new"
          expand="full"
          fill="outline"
          onClick={() => logoutWithRedirect()}
        >
          Log out
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Setting;
