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
  IonButtons,
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
  request_delete,
} from "../auth_fetch/index";
import { useAuth0 } from "@auth0/auth0-react";

const Addprogram = ({ history }) => {
  const [programName, setProgramName] = useState();
  const [text, setText] = useState();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedDate, setSelectedDate] = useState();
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [artist, setArtist] = useState();
  const [notiTime, setNotiTime] = useState("20:00");
  const [notiDate, setNotiDate] = useState("pre");
  const [data, setData] = useState([]);
  const [userNoti, setUserNoti] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useIonViewWillEnter(() => {
    request_user_tv_list(getAccessTokenSilently).then((data) => {
      setData(data);
    });
  }, []);

  useIonViewWillEnter(() => {
    request(
      `${process.env.REACT_APP_API_ENDPOINT}/get_user_notification`,
      getAccessTokenSilently
    ).then((data) => {
      setUserNoti(data);
    });
  }, []);
  //console.log(notiTime);

  useEffect(() => {
    if (userNoti !== null && userNoti !== undefined) {
      const notiList = userNoti.split(/[/:]/);
      //console.log(notiList);
      setNotiTime(notiList[1] + ":" + notiList[2]);
      setNotiDate(notiList[0]);
    }
  });

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
    { name: "藪宏太" },
    { name: "全員" },
  ];

  const sendData = () => {
    if (
      selectedChannel === null ||
      selectedDate === null ||
      programName === null ||
      artist === null
    ) {
      alert("記入漏れがあります");
      return 0;
    }

    //同じ日にちのものがない確認し、なければ通知の予約をする
    setNotification();

    //const dateList = data.date.split(/[-T:]/);
    const dateList = selectedDate.split(/[-T:]/);
    // const current = new Date();
    console.log(dateList);
    const date = new Date(
      dateList[0],
      dateList[1] - 1,
      dateList[2],
      dateList[3],
      dateList[4],
      0,
      0
    );
    //const realDate = date.getUTCMonth();
    //console.log(realDate);

    console.log(date);

    const data = {
      channel: selectedChannel,
      //date: selectedDate,
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

    console.log(data);

    return request_put(
      `${process.env.REACT_APP_API_ENDPOINT}/add_tv_list`,
      getAccessTokenSilently,
      data
    );
  };

  const setNotification = () => {
    let d;
    if (data === []) {
      //通知する
      CheckAndNoti(selectedDate, selectedDate);
    } else {
      for (let i = 0; i < data.length; i++) {
        d = CheckAndNoti(data[i].date, selectedDate);
        if (d === 1) {
          break;
        }
      }
    }
  };

  const CheckAndNoti = (a, b) => {
    const dateListA = a.split(/[-T:]/);
    const dateListB = b.split(/[-T:]/);
    const dateB = new Date(
      dateListB[0],
      dateListB[1] - 1,
      dateListB[2],
      dateListB[3],
      dateListB[4],
      0,
      0
    );

    if (
      //すでにその日に番組がある場合通知しない
      a !== b &&
      dateListA[0] === dateListB[0] &&
      dateListA[1] === dateListB[1] &&
      dateListA[2] === dateListB[2]
    ) {
      return 0;
    } else {
      //通知する 000* 60 * 60*24
      console.log("通知する！");

      const dateList = b.split(/[-T:]/);
      const notiDateList = notiTime.split(/[-T:]/);
      const current = new Date();
      let y = dateList[0],
        m = dateList[1],
        d = dateListB[2];

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
      console.log(date);
      console.log(current);
      const diff = date.getTime() - current.getTime();
      const second = Math.floor(diff / 1000);
      console.log(second);
      if (second > 0) {
        notifications.schedule(second);
        /*console.log(log);

        let notiData = JSON.parse(localStorage.getItem("notiData"));
        if (notiData == null || notiData === undefined) {
          notiData = [log];
        } else {
          notiData.push(log);
        }
        localStorage.setItem("notiData", JSON.stringify(notiData));*/
      }

      return 1;
    }
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
