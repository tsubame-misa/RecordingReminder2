import React from "react";
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
  IonBackButton,
  IonButtons,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonInput,
} from "@ionic/react";
//import { add, contractOutline, map, star, trash } from "ionicons/icons";
import { useState } from "react";
//import notifications from "../notification/index";
//import { convertDate } from "../pages/Future";
//import { isComputedPropertyName } from "typescript";
import { useHistory } from "react-router-dom";

const Addprogram = () => {
  const [programName, setProgramName] = useState();
  const [text, setText] = useState();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedDate, setSelectedDate] = useState();
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [artist, setArtist] = useState();
  // const [notiDate, setNotiDate] = useState();
  //const [notiTime, setNotiTime] = useState();
  //const [count, setCount] = useState();
  let history = useHistory();

  /*useEffect(() => {
    if ("notiDate" in localStorage) {
      setNotiDate(JSON.parse(localStorage.getItem("notiDate")));
    } else {
      setNotiDate("pre");
    }
  }, []);

  useEffect(() => {
    if ("notiTime" in localStorage) {
      setNotiTime(JSON.parse(localStorage.getItem("notiTime")));
    } else {
      setNotiTime("2000-01-01T22:00:00+09:00");
    }
  }, []);

  useEffect(() => {
    if ("count" in localStorage) {
      setCount(JSON.parse(localStorage.getItem("count")));
    }
  }, []);*/

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
      return;
    }

    //同じ日にちのものがない確認し、なければ通知の予約をする
    //setNotification();

    //const dateList = data.date.split(/[-T:]/);
    const dateList = selectedDate.split(/[-T:]/);
    //const current = new Date();
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

    /*const data =
      selectedChannel +
      "," +
      date +
      "," +
      programName +
      "," +
      artist +
      "," +
      startTime +
      "," +
      endTime;*/
    window.fetch(`http://localhost:8080/add_tv_list`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    /*let datalist = JSON.parse(localStorage.getItem("data"));
    if (datalist === null) {
      datalist = [data];
    } else {
      datalist.push(data);
    }*/

    /*datalist.sort((a, b) => {
      if (a.date > b.date) {
        return 1;
      } else {
        return -1;
      }*
    });*/

    //localStorage.setItem("data", JSON.stringify(datalist));
    //localStorage.setItem("count", JSON.stringify(count + 1));

    setSelectedChannel(null);
    setSelectedDate(null);
    setProgramName(null);
    setArtist(null);
    setStartTime(null);
    setEndTime(null);
    setText(null);

    history.push("/future");
  };
  /*
  const setNotification = () => {
    let datalist = JSON.parse(localStorage.getItem("data"));
    let d;
    if (datalist === null) {
      CheckAndNoti(selectedDate, selectedDate);
    } else {
      for (let i = 0; i < datalist.length; i++) {
        d = CheckAndNoti(datalist[i].date, selectedDate);
        if (d === 1) {
          break;
        }
      }
    }
  };*/
  /*
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
    console.log(dateB);

    if (
      a !== b &&
      dateListA[0] === dateListB[0] &&
      dateListA[1] === dateListB[1] &&
      dateListA[2] === dateListB[2]
    ) {
      //通知しない
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

      const date = new Date(y, m, d, notiDateList[3], notiDateList[4], 0, 0);

      //差分の秒数後に通知
      const diff = date.getTime() - current.getTime();
      const second = Math.floor(diff / 1000);
      console.log(second);
      if (second > 0) {
        notifications.schedule(second);
      }

      return 1;
    }
  };
   */
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
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
          onClick={() => {
            sendData();
          }}
        >
          登録
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Addprogram;
