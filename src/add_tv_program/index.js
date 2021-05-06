import React, { useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonTextarea,
  IonItem,
  IonLabel,
  IonButton,
  //IonButtons,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonInput,
  useIonViewWillEnter,
  IonBackButton,
} from "@ionic/react";
import { useState } from "react";
import notifications from "../notification/index";
import {
  request_put,
  request_user_tv_list,
  request,
} from "../auth_fetch/index";
import { useAuth0 } from "@auth0/auth0-react";
import { useStorage } from "@ionic/react-hooks/storage";
import { convertCompilerOptionsFromJson, getSourceMapRange } from "typescript";

const Addprogram = ({ history }) => {
  const [programName, setProgramName] = useState();
  const [text, setText] = useState();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedDate, setSelectedDate] = useState();
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [artist, setArtist] = useState();
  const [notiTime, setNotiTime] = useState();
  const [notiDate, setNotiDate] = useState();
  //const [data, setData] = useState([]);
  const [userNoti, setUserNoti] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  const TASKS_STORAGE = "tasks";
  const { get, set, remove } = useStorage();
  const [tasks2, setTask2] = useState([{ id: "19990909", min: 1 }]);

  /*useIonViewWillEnter(() => {
    request_user_tv_list(getAccessTokenSilently).then((data) => {
      setData(data);
    });
  }, []);*/

  useIonViewWillEnter(() => {
    request(
      `${process.env.REACT_APP_API_ENDPOINT}/get_user_notification`,
      getAccessTokenSilently
    ).then((data) => {
      const data_list = data.split(/[/]/);
      console.log(data_list);
      setNotiDate(data_list[0]);
      setNotiTime(data_list[1]);
    });
  }, [notiDate, notiTime]);

  /*useEffect(() => {
    if (userNoti !== null && userNoti !== undefined) {
      const notiList = userNoti.split(/[/:]/);
      //console.log(notiList);
      setNotiTime(notiList[1] + ":" + notiList[2]);
      setNotiDate(notiList[0]);
    }
  });*/

  useEffect(() => {
    const getTasks = async () => {
      const tasksString = await get(TASKS_STORAGE);
      const taskData = tasksString ? JSON.parse(tasksString) : [];
      setTask2(taskData);
    };
    getTasks();
  }, [get]);

  const channel = [
    { name: "NHK総合" },
    { name: "Eテレ" },
    { name: "日テレ" },
    { name: "テレビ東京" },
    { name: "TBS" },
    { name: "テレビ朝日" },
    { name: "フジテレビ" },
    { name: "東京MX" },
  ];

  const artists = [
    { name: "山田涼介" },
    { name: "知念侑李" },
    { name: "中島裕翔" },
    { name: "岡本圭人" },
    { name: "有岡大貴" },
    { name: "伊野尾慧" },
    { name: "高木雄也" },
    { name: "八乙女光" },
    { name: "藪宏太　" },
    { name: "全員" },
  ];

  const sendData = () => {
    if (
      selectedChannel === null ||
      selectedDate === null ||
      programName === null ||
      artist === null
    ) {
      /*ionAlertに直す */
      alert("記入漏れがあります");
      return 0;
    }

    const dateList = selectedDate.split(/[-T:]/);
    const date = new Date(
      dateList[0],
      dateList[1] - 1,
      dateList[2],
      dateList[3],
      dateList[4],
      0,
      0
    );

    const data = {
      channel: selectedChannel,
      date: date,
      name: programName,
      artist: artist,
      startTime: startTime,
      endTime: endTime,
      comment: text,
    };

    setSelectedChannel(null);
    setSelectedDate(null);
    setProgramName(null);
    setArtist(null);
    setStartTime(null);
    setEndTime(null);
    setText(null);

    //同じ日にちのものがない確認し、なければ通知の予約をする
    //setNotification(date);
    CheckAndNoti(date, selectedDate, date);

    return request_put(
      `${process.env.REACT_APP_API_ENDPOINT}/add_tv_list`,
      getAccessTokenSilently,
      data
    );
  };

  const CheckAndNoti = (a, b, preDate) => {
    const item = calcSecond(b);
    const id = item["id"];
    const second = item["second"];

    //同じ日時があったら通知しない(is_notiをfalseに)
    let is_noti = true;
    for (let item of tasks2) {
      if (item.id === id) {
        console.log("aaa", item.id, id);
        is_noti = false;
        break;
      }
    }

    console.log(second, is_noti);

    if (second > 0 && is_noti) {
      console.log("通知する！！");
      //通知の前からある予約の秒数の再設定
      for (let item of tasks2) {
        const obj = calcSecond(item.date);
        item.id = obj.id;
        item.min = obj.second;
        if (item.min < 0) {
          item.rm = true;
        }
      }
      tasks2.push({ id: id, min: second, date: b, rm: false });
      set(TASKS_STORAGE, JSON.stringify(tasks2));
      console.log(tasks2);
      const d2 = tasks2.filter((item) => item.rm !== true);
      remove(TASKS_STORAGE);
      setTask2(d2);
      console.log(d2);
      set(TASKS_STORAGE, JSON.stringify(tasks2));
      console.log(tasks2);
      notifications.schedule(tasks2);
      return 1;
    } else {
      console.log("通知しない");
      return 0;
    }
  };

  const calcSecond = (b) => {
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
    console.log(notiDateList);
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
    console.log(date);
    console.log(current);
    //差分の秒数後に通知
    const diff = date.getTime() - current.getTime();
    console.log(date, current, diff);
    const second = Math.floor(diff / 1000);
    return { id: id, second: second };
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton slot="start" defaultHref="/" />
          <IonTitle>番組を登録する</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonInput
            value={programName}
            placeholder="番組名"
            onIonChange={(e) => setProgramName(e.detail.value)}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel>チャンネル名</IonLabel>
          <IonSelect
            value={selectedChannel}
            okText="Okay"
            cancelText="Dismiss"
            onIonChange={(e) => {
              setSelectedChannel(e.detail.value);
            }}
          >
            {channel.map((t, id) => {
              return (
                <IonSelectOption value={t.name} key={id}>
                  {t.name}
                </IonSelectOption>
              );
            })}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel>日時</IonLabel>
          <IonDatetime
            displayFormat="YYYY/MM/DD/ HH:mm"
            placeholder="Select Date"
            value={selectedDate}
            onIonChange={(e) => setSelectedDate(e.detail.value)}
          ></IonDatetime>
        </IonItem>

        <IonItem>
          <IonLabel>アーティスト</IonLabel>
          <IonSelect
            value={artist}
            okText="Okay"
            cancelText="Dismiss"
            multiple={true}
            onIonChange={(e) => {
              setArtist(e.detail.value);
            }}
          >
            {artists.map((a, id) => {
              return (
                <IonSelectOption value={a.name} key={id}>
                  {a.name}
                </IonSelectOption>
              );
            })}
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel>アーティスト出演時刻</IonLabel>
          {/*別の形式がいいかもしれない */}
          <IonDatetime
            displayFormat="HH:mm"
            placeholder="Start"
            value={startTime}
            onIonChange={(e) => setStartTime(e.detail.value)}
          ></IonDatetime>
          <IonDatetime
            displayFormat="HH:mm"
            placeholder="End"
            value={endTime}
            onIonChange={(e) => setEndTime(e.detail.value)}
          ></IonDatetime>
        </IonItem>
        <IonItem>
          <IonTextarea
            placeholder="その他・コメント"
            value={text}
            onIonChange={(e) => setText(e.detail.value)}
          ></IonTextarea>
        </IonItem>
        <IonButton
          color="dark"
          expand="full"
          onClick={async () => {
            const i = await sendData();
            if (i !== 0) {
              history.push("/future");
            }
          }}
        >
          登録
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Addprogram;
