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
  IonCheckbox,
  IonList,
  IonCard,
  IonAlert,
} from "@ionic/react";
//import { add, contractOutline, map, star, trash } from "ionicons/icons";
import { useState } from "react";
import notifications from "../notification/index";
//import { convertDate } from "../pages/Future";
//import { isComputedPropertyName } from "typescript";
import { useHistory, useParams } from "react-router-dom";
import { convertToObject } from "typescript";

const Detail = ({ history }) => {
  const [programName, setProgramName] = useState(null);
  const [text, setText] = useState();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedDate, setSelectedDate] = useState();
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  //const [artist, setArtist] = useState();
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
  // const [cgArtist, setCgArtist] = useState(1);
  const [showAlert, setShowAlert] = useState(false);

  //let history = useHistory();
  const [data, setData] = useState([]);
  const item = useParams();
  const id = item.id;

  const path = window.location.pathname;
  const pathList = path.split(/[/]/);
  const backPass = pathList[pathList.length - 1];
  // console.log(pathList[pathList.length - 1]);

  useEffect(() => {
    window
      .fetch(`http://localhost:8080/get_user_list/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);
  //console.log(data);

  useEffect(() => {
    if (data != []) {
      setPreChannel(data.channel);
      setPreProgramName(data?.name);
      setPreDate(data.date);
      setPreArtist(data.artist);
      setPreStartTime(data.start_time);
      //console.log(preStartTime);
      setPreEndTime(data.end_time);
      setPreText(data.comment);
    }
  });
  //console.log(preChannel);
  //console.log(preProgramName);

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

  const isChecked = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  if (preArtist != undefined) {
    for (let i = 0; i < artists.length; i++) {
      if (preArtist.includes(artists[i].name)) {
        isChecked[i] = 1;
      }
    }
  }

  const sendData = () => {
    let artistData = [];
    for (let i = 0; i < artists.length; i++) {
      if (isChecked[i]) {
        artistData.push(artists[i].name);
      }
    }
    console.log(artistData);
    console.log(preArtist);

    if (
      selectedChannel === preChannel &&
      selectedDate === preDate &&
      programName === preProgramName &&
      artistData === preArtist &&
      startTime === preStartTime &&
      endTime === preEndTime &&
      text === preText
    ) {
      alert("変更はありません");
      return;
    }

    if (
      selectedChannel === null ||
      selectedDate === null ||
      programName === "" ||
      artistData === null
    ) {
      alert("記入漏れがあります");
      return;
    }

    //const dateList = data.date.split(/[-T:]/);
    const dateList = selectedDate.split(/[-T:]/);
    const current = new Date();
    //console.log(dateList);
    const date = new Date(
      dateList[0],
      dateList[1] - 1,
      dateList[2],
      dateList[3],
      dateList[4],
      0,
      0
    );

    //console.log(date);

    const data = {
      channel: selectedChannel,
      //date: selectedDate,
      date: date,
      name: programName,
      artist: artistData,
      startTime: startTime,
      endTime: endTime,
      comment: text,
    };
    console.log(data);

    window.fetch(`http://localhost:8080/change_user_tv_program/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    setShowAlert(true);
    //history.push("/future");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            {backPass == "from_future" ? (
              <IonBackButton defaultHref="/" />
            ) : (
              <IonBackButton defaultHref="/past" />
            )}
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

        {/*できれば２＊５にしたい*/}
        <IonCard>
          <IonItem>アーティスト</IonItem>
          {artists.map((a, i) => (
            <IonItem key={i}>
              <IonLabel>{a.name}</IonLabel>
              <IonCheckbox
                slot="end"
                value={1}
                checked={isChecked[i]}
                onIonChange={() => {
                  isChecked[i] == 1 ? (isChecked[i] = 0) : (isChecked[i] = 1);
                }}
              />
            </IonItem>
          ))}
        </IonCard>

        <IonItem>
          <IonLabel>アーティスト出演時刻</IonLabel>
          {/*別の形式がいいかもしれない */}
          <IonDatetime
            displayFormat="HH:mm"
            placeholder="Start"
            value={cgStartTime == 1 ? preStartTime : startTime}
            onIonChange={(e) => {
              setCgStartTime(0);
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
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="my-custom-class"
          header={"変更しました"}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Detail;
