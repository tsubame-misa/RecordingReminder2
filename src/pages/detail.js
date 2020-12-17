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
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  request_user_tv_list,
  request_put,
  request_delete,
  request,
} from "../auth_fetch/index";
import { useAuth0 } from "@auth0/auth0-react";

const Detail = ({ history }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [data, setData] = useState(null);
  const item = useParams();
  const id = item.id;
  const path = window.location.pathname;
  const pathList = path.split(/[/]/);
  const backPass = pathList[pathList.length - 1];
  const { getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();

  useIonViewWillEnter(() => {
    request(
      `${process.env.REACT_APP_API_ENDPOINT}/get_user_list/${id}`,
      getAccessTokenSilently
    ).then((data) => {
      setData(data);
    });
  }, []);

  const channel = [
    { name: "NHK総合" },
    { name: "Eテレ" },
    { name: "日テレ" },
    { name: "テレビ朝日" },
    { name: "TBS" },
    { name: "テレビ東京" },
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
    const date = new Date(data.date);
    data.date = date;
    request_put(
      `${process.env.REACT_APP_API_ENDPOINT}/change_user_tv_program/${id}`,
      getAccessTokenSilently,
      data
    ).then(() => {
      setShowAlert(true);
    });
  };

  if (data == null || data === undefined || data === []) {
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
        <IonContent></IonContent>
      </IonPage>
    );
  }

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendData();
          }}
        >
          <IonItem>
            <IonInput
              value={data.name}
              required
              placeholder="番組名"
              onIonChange={(e) => {
                setData(Object.assign({}, data, { name: e.detail.value }));
              }}
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel>チャンネル名</IonLabel>
            <IonSelect
              value={data.channel}
              required
              okText="Okay"
              cancelText="Dismiss"
              onIonChange={(e) => {
                setData(Object.assign({}, data, { name: e.detail.value }));
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
              required
              value={data.date}
              onIonChange={(e) => {
                setData(Object.assign({}, data, { date: e.detail.value }));
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
                  required
                  checked={
                    data != null &&
                    data !== undefined &&
                    data.artist !== undefined &&
                    data.artist.includes(a.name)
                  }
                  onIonChange={() => {
                    if (data.artist.includes(a.name)) {
                      setData(
                        Object.assign({}, data, {
                          artist: data.artist.filter((name) => name !== a.name),
                        })
                      );
                    } else {
                      setData(
                        Object.assign({}, data, {
                          artist: data.artist.concat([a.name]),
                        })
                      );
                    }
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
              value={data.startTime}
              onIonChange={(e) => {
                setData(Object.assign({}, data, { startTime: e.detail.value }));
              }}
            ></IonDatetime>
            <IonDatetime
              displayFormat="HH:mm"
              placeholder="End"
              value={data.endTime}
              onIonChange={(e) => {
                setData(Object.assign({}, data, { endTime: e.detail.value }));
              }}
            ></IonDatetime>
          </IonItem>
          <IonItem>
            <IonTextarea
              placeholder="その他・コメント"
              value={data.comment}
              onIonChange={(e) => {
                setData(Object.assign({}, data, { comment: e.detail.value }));
              }}
            ></IonTextarea>
          </IonItem>
          <IonButton color="dark" expand="full" type="submit">
            変更する
          </IonButton>
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            cssClass="my-custom-class"
            header={"変更しました"}
            buttons={["OK"]}
          />
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Detail;
