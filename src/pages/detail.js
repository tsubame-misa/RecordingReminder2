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
  IonBackButton,
  IonButtons,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonInput,
  useIonViewWillEnter,
} from "@ionic/react";
//import { add, contractOutline, map, star, trash } from "ionicons/icons";
import { useState } from "react";
import notifications from "../notification/index";
//import { convertDate } from "../pages/Future";
//import { isComputedPropertyName } from "typescript";
import { useHistory, useParams } from "react-router-dom";

const Detail = () => {
  const [programName, setProgramName] = useState();
  const [text, setText] = useState();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedDate, setSelectedDate] = useState();
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [artist, setArtist] = useState();
  const [preProgramName, setPreProgramName] = useState();
  const [preText, setPreText] = useState();
  const [preChannel, setPreChannel] = useState(null);
  const [preDate, setPreDate] = useState();
  const [preStartTime, setPreStartTime] = useState(null);
  const [preEndTime, setPreEndTime] = useState(null);
  const [preArtist, setPreArtist] = useState();
  const [cgName, setCgName] = useState(1);
  const [cgText, setCgText] = useState(1);
  const [cgChannel, setCgChannel] = useState(1);
  const [cgDate, setCgDate] = useState(1);
  const [cgStartTime, setCgStartTime] = useState(1);
  const [cgEndTime, setCgEndTime] = useState(1);
  const [cgArtist, setCgArtist] = useState(1);

  let history = useHistory();
  const [data, setData] = useState([]);
  const item = useParams();
  const id = item.id;
  console.log(item);

  useEffect(() => {
    window
      .fetch(`http://localhost:8080/get_user_list/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);
  console.log(data);

  useEffect(() => {
    if (data != []) {
      setPreChannel(data.channel);
      setProgramName(data.name);
      setPreDate(data.date);
      setPreArtist(data.artist);
      console.log(preArtist);
      setPreStartTime(data.startTime);
      setPreEndTime(data.end);
      setPreText(data.comment);
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
      return;
    }

    //const dateList = data.date.split(/[-T:]/);
    const dateList = selectedDate.split(/[-T:]/);
    const current = new Date();
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

    window.fetch(`http://localhost:8080/add_tv_list`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    setSelectedChannel(null);
    setSelectedDate(null);
    setProgramName(null);
    setArtist(null);
    setStartTime(null);
    setEndTime(null);
    setText(null);

    history.push("/future");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>番組詳細</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonInput
            value={cgName == 1 ? preProgramName : programName}
            placeholder="番組名"
            onIonChange={(e) => {
              setCgName(0);
              setProgramName(e.detail.value);
            }}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel>チャンネル名</IonLabel>
          <IonSelect
            value={cgChannel == 1 ? preChannel : selectedChannel}
            okText="Okay"
            cancelText="Dismiss"
            onIonChange={(e) => {
              setCgChannel(0);
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
            value={cgDate == 1 ? preDate : selectedDate}
            onIonChange={(e) => {
              setCgDate(0);
              setSelectedDate(e.detail.value);
            }}
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
            value={cgStartTime == 1 ? preStartTime : startTime}
            onIonChange={(e) => {
              cgStartTime(0);
              setStartTime(e.detail.value);
            }}
          ></IonDatetime>
          <IonDatetime
            displayFormat="HH:mm"
            placeholder="End"
            value={cgEndTime == 1 ? preEndTime : endTime}
            onIonChange={(e) => {
              setCgEndTime(0);
              setEndTime(e.detail.value);
            }}
          ></IonDatetime>
        </IonItem>
        <IonItem>
          <IonTextarea
            placeholder="その他・コメント"
            value={cgText == 1 ? preText : text}
            onIonChange={(e) => {
              setCgText(0);
              setText(e.detail.value);
            }}
          ></IonTextarea>
        </IonItem>
        <IonButton
          color="dark"
          expand="full"
          onClick={() => {
            sendData();
          }}
        >
          変更する
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Detail;
