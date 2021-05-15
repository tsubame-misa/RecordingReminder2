import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonAlert,
  useIonViewWillEnter,
  IonLabel,
  IonItemDivider,
} from "@ionic/react";
import { useStorage } from "@ionic/react-hooks/storage";
import notifications from "../notification/index";
import { convertDate, CmpTime, convertIcon } from "../pages/Future";
import { useAuth0 } from "@auth0/auth0-react";
import { request, request_put } from "../auth_fetch/index";
const splitArtist = (item) => {
  if (item === undefined) {
    return;
  }
  const dateList = item.split(/["}{,]/);
  console.log(dateList);
  return dateList.splice(1, dateList.length - 2);
};

const Future = () => {
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [idx, setIdx] = useState(-1);
  const { getAccessTokenSilently } = useAuth0();
  const date_data = [];
  const [notiTime, setNotiTime] = useState();
  const [notiDate, setNotiDate] = useState();
  const [notiChecked, setNotiChecked] = useState();
  //const [data, setData] = useState([]);

  const TASKS_STORAGE = "tasks";
  const { get, set } = useStorage();
  const [tasks2, setTask2] = useState([{ id: "19990909", min: 1 }]);

  useIonViewWillEnter(() => {
    request(
      "https://blooming-coast-85852.herokuapp.com/api/get_all_list",
      //`${process.env.REACT_APP_API_ENDPOINT}/get_all_list`,
      getAccessTokenSilently
    ).then((data) => {
      setData(data);
    });
    request(
      "https://blooming-coast-85852.herokuapp.com/api/get_user_notification",
      //`${process.env.REACT_APP_API_ENDPOINT}/get_user_notification`,
      getAccessTokenSilently
    ).then((data) => {
      const data_list = data?.split(/[/]/);
      if (data_list) {
        setNotiDate(data_list[0]);
        setNotiTime(data_list[1]);
      }
    });
  }, [notiDate, notiTime]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksString = await get(TASKS_STORAGE);
      const taskData = tasksString ? JSON.parse(tasksString) : [];
      setTask2(taskData);
    };
    getTasks();
    const data = JSON.parse(localStorage.getItem("noti"));
    console.log(data);
    if (data === null) {
      setNotiChecked(true);
      localStorage.setItem("noti", true);
    } else {
      setNotiChecked(data);
    }
    console.log(notiChecked);
  }, [get, notiChecked]);

  if (data !== [] && data !== undefined) {
    data.sort((a, b) => {
      const a_date = convertDate(a.date);
      const b_date = convertDate(b.date);
      if (a_date > b_date) {
        return 1;
      } else {
        return -1;
      }
    });
    for (let i = 0; i < data.length; i++) {
      const d = convertDate(data[i].date).slice(0, 10);
      if (!date_data.includes(d)) {
        date_data.push([d, 0]);
      }
    }
  }

  const check = (date) => {
    for (let i = 0; i < date_data.length; i++) {
      if (date === date_data[i][0] && date_data[i][1] === 0) {
        date_data[i][1] = 1;
        return 1;
      }
      if (date <= date_data[i][0]) {
        return 0;
      }
    }
    return 0;
  };

  const findIndx = (ID) => {
    if (data !== undefined) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === ID) {
          setIdx(i);
        }
      }
    }
    console.log(idx);
  };

  const addMyList = (idx) => {
    CheckAndNoti(convertDate(data[idx].date));
    request_put(
      `https://blooming-coast-85852.herokuapp.com/api/put_my_list/${data[idx].id}`,
      //`${process.env.REACT_APP_API_ENDPOINT}/put_my_list/${data[idx].id}`,
      getAccessTokenSilently,
      data
    );
  };

  const CheckAndNoti = (b) => {
    console.log(b);
    const item = calcSecond(b);
    const id = item["id"];
    const second = item["second"];

    //同じ日時があったら通知しない(is_notiをfalseに)
    //ダブらせる実験やってみる
    let is_noti = true;
    for (let item of tasks2) {
      if (item.id === id) {
        is_noti = false;
        break;
      }
    }
    console.log("notiCheck ", notiChecked);
    console.log(second, is_noti);
    if (second > 0 && is_noti) {
      console.log("通知する！！");
      tasks2.push({ id: id, min: second, date: b, rm: false });
      set(TASKS_STORAGE, JSON.stringify(tasks2));
      console.log(tasks2);
      console.log("notiCheck ", notiChecked);
      if (notiChecked) {
        notifications.schedule({ id: id, min: second, date: b, rm: false });
      } else {
        console.log("今は通知しない");
      }
      return 1;
    } else {
      console.log("通知しない");
      return 0;
    }
  };

  const calcSecond = (b) => {
    console.log(b);
    const dateList = b.split(/[-T:T/]/);
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
    console.log(notiDateList);
    const date = new Date(y, m, d, notiDateList[0], notiDateList[1], 0, 0);
    console.log(date);
    console.log(current);
    //差分の秒数後に通知
    const diff = date.getTime() - current.getTime();
    console.log(date, current, diff / 1000);
    const second = Math.floor(diff / 1000);
    return { id: id, second: second };
  };

  if (data === [] || data === undefined) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="new">
            <IonTitle>録画済み</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen></IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="new">
          <IonTitle>探す</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {data
          .filter((d) => {
            return CmpTime(d.date) > 0;
          })
          .map((d, id) => {
            const date = convertDate(d.date);
            return (
              <div key={id}>
                {check(date.slice(0, 10)) === 1 ? (
                  <IonItemDivider>
                    <IonLabel>{date.slice(0, 10)}</IonLabel>
                  </IonItemDivider>
                ) : (
                  []
                )}
                <IonItem
                  key={id}
                  _ngcontent-yfv-c79=""
                  onClick={() => {
                    findIndx(d.id);
                    setShowAlert(true);
                  }}
                  detail="false"
                  target="_blank"
                  class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
                >
                  <img
                    className="icon_image"
                    src={convertIcon(d.channel)}
                    alt=""
                  ></img>
                  <IonLabel>
                    &emsp; {date.slice(11)} &emsp; {d.name}
                  </IonLabel>
                </IonItem>
              </div>
            );
          })}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => {
            setShowAlert(false);
          }}
          cssClass="my-custom-class"
          header={data[idx]?.name}
          // オプショナルチェイニングoptional chaining演算子 ?.
          subHeader={data[idx]?.channel + " " + convertDate(data[idx]?.date)}
          message={splitArtist(data[idx]?.artist) + " " + data[idx]?.comment}
          buttons={[
            {
              text: "戻る",
            },
            {
              text: "登録",
              handler: () => {
                addMyList(idx);
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Future;
