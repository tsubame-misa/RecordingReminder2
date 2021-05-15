import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonButton,
  IonAlert,
  useIonViewWillEnter,
  IonBackButton,
} from "@ionic/react";
import { request_put, request } from "../auth_fetch/index";
import { useAuth0 } from "@auth0/auth0-react";
import { useStorage } from "@ionic/react-hooks/storage";
import notifications from "../notification/index";
import { CmpTime } from "../pages/Future";
import "../pages/styles.css";

const Setting = () => {
  const [notiTime, setNotiTime] = useState(null);
  const [date, setDate] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  //const [userNoti, setUserNoti] = useState(null);
  const [notiTimeChenged, setNotiTimeChanged] = useState(1);
  const [notiDateChenged, setNotiDateChanged] = useState(1);
  const [preNotiTime, setPreNotiTime] = useState("20:00");
  const [preNotiDate, setPreNotiDate] = useState("pre");
  //const [checked, setChecked] = useState(1);
  const { getAccessTokenSilently } = useAuth0();

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
      console.log(data_list);
      setPreNotiDate(data_list[0]);
      setPreNotiTime(data_list[1]);
      console.log(preNotiDate, preNotiTime);
    });

    const getTasks = async () => {
      const tasksString = await get(TASKS_STORAGE);
      const taskData = tasksString ? JSON.parse(tasksString) : [];
      setTask2(taskData);
    };
    getTasks();
  }, []);

  /*useEffect(() => {
    const getTasks = async () => {
      const tasksString = await get(TASKS_STORAGE);
      const taskData = tasksString ? JSON.parse(tasksString) : [];
      setTask2(taskData);
    };
    getTasks();
  }, [get]);*/

  /*useIonViewWillEnter(async () => {
    const d = await request_user_tv_list(getAccessTokenSilently);
    setData(d);
  });*/

  /* useEffect(() => {
    if (userNoti !== null && userNoti !== undefined) {
      const notiList = userNoti.split(/[/:]/);
      setPreNotiTime(notiList[1] + ":" + notiList[2]);
      setPreNotiDate(notiList[0]);
    }
  });*/

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
    //notifications.removeAllListeners();
    for (let item of tasks2) {
      const obj = calcSecond(item.date, d);
      item.id = obj.id;
      item.min = obj.second;

      /*if (item.min < 0) {
        item.rm = true;
      }*/
      if (item.min > 0) {
        notifications.schedule(item);
      }
      //番組日時から二日以上すぎていたら通知候補リスト削除
      if (CmpTime(item.date) < 0 /*-1 * 86400 * 2*/) {
        console.log(CmpTime(item.date) < 0);
        item.rm = true;
      }
    }
    //console.log(tasks2);
    const d2 = tasks2.filter((item) => item.rm !== true);
    //console.log(d2);
    remove(TASKS_STORAGE);
    setTask2(d2);
    //console.log(d2);
    console.log(tasks2);
    set(TASKS_STORAGE, JSON.stringify(tasks2));
    console.log(tasks2);
    //notifications.stopLocalPush();
    // notifications.removeAllListeners();

    //notifications.schedule(d2);
    /*
    notifications.stopLocalPush();
    console.log(tasks2);
    notifications.schedule(tasks2);*/
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

    const notiDateList = notiTime.split(/[-T:]/);
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

  const cancelNoti = () => {
    notifications.stopLocalPush();
    remove(TASKS_STORAGE);
  };
  const checklNoti = () => {
    notifications.check();
    remove(TASKS_STORAGE);
  };

  return (
    /*<IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton slot="start" defaultHref="/setting" />
          <IonTitle>通知</IonTitle>
        </IonToolbar>
      </IonHeader>*/
    /*<IonContent fullscreen>*/
    /*} <IonList>
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
  </IonList>*/
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
      {/*<IonItem>
        {" "}
        <IonButton
          slot="end"
          color="dark"
          onClick={() => {
            cancelNoti();
          }}
        >
          通知を全部取り消す
        </IonButton>
      </IonItem>
      <IonItem>
        {" "}
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
        */}
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
      {/*</IonContent>*/}
      {/*</IonPage>*/}
    </div>
  );
};

export default Setting;
