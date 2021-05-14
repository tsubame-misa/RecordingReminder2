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
  useIonViewWillEnter,
  IonCheckbox,
  IonCard,
  IonAlert,
  IonGrid,
  IonRow,
  IonItemGroup,
  IonLifeCycleContext,
  IonList,
} from "@ionic/react";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { request_put, request } from "../auth_fetch/index";
import { useAuth0 } from "@auth0/auth0-react";
import { chevronBackOutline } from "ionicons/icons";

const Detail = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [data, setData] = useState(null);
  const item = useParams();
  const id = item.id;
  const pathList = useLocation().pathname.split(/[/]/);
  const backPass = pathList[pathList.length - 1];
  const { getAccessTokenSilently } = useAuth0();

  useIonViewWillEnter(() => {
    request(
      `https://blooming-coast-85852.herokuapp.com/api/get_user_list/${id}`,
      //`${process.env.REACT_APP_API_ENDPOINT}/get_user_list/${id}`,
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
      `https://blooming-coast-85852.herokuapp.com/api/change_user_tv_program/${id}`,
      //`${process.env.REACT_APP_API_ENDPOINT}/change_user_tv_program/${id}`,
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
          <IonToolbar color="new">
            <IonButtons slot="start">
              {backPass === "from_future" ? (
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
        <IonToolbar color="new">
          <IonButtons slot="start">
            {backPass === "from_future" ? (
              <IonBackButton
                slot="start"
                fill="clear"
                defaultHref="/"
                icon={chevronBackOutline}
              />
            ) : (
              <IonBackButton
                slot="start"
                fill="clear"
                defaultHref="/past"
                icon={chevronBackOutline}
              />
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
              okText="完了"
              cancelText="キャンセル"
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
              doneText="完了"
              cancelText="キャンセル"
              required
              value={data.date}
              onIonChange={(e) => {
                setData(Object.assign({}, data, { date: e.detail.value }));
              }}
            ></IonDatetime>
          </IonItem>

          {/*できれば２＊５にしたい*/}
          <div>
            <IonItem lines="none">アーティスト</IonItem>
            <IonGrid
              style={{
                borderBottom: "solid 0.1px #d7d8da",
                padding: "0px",
                marginLeft: "20px",
                marginTop: "-0.85rem",
              }}
            >
              <IonRow>
                {artists.map((a, i) => (
                  <IonItem key={i} lines="none">
                    {a.name.length < 4 ? (
                      a.name.length === 2 ? (
                        <IonLabel>{a.name}&emsp;&emsp;</IonLabel>
                      ) : (
                        <IonLabel>{a.name}&emsp;</IonLabel>
                      )
                    ) : (
                      <IonLabel>{a.name}</IonLabel>
                    )}

                    <IonCheckbox
                      slot="end"
                      required
                      color="medium"
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
                              artist: data.artist.filter(
                                (name) => name !== a.name
                              ),
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
              </IonRow>
            </IonGrid>
          </div>

          <IonItem>
            <IonLabel>アーティスト出演時刻</IonLabel>
            {/*別の形式がいいかもしれない */}
            <IonDatetime
              displayFormat="HH:mm"
              placeholder="開始"
              value={data.startTime}
              doneText="完了"
              className="キャンセル"
              onIonChange={(e) => {
                setData(Object.assign({}, data, { startTime: e.detail.value }));
              }}
            ></IonDatetime>
            <IonDatetime
              displayFormat="HH:mm"
              placeholder="終了"
              value={data.endTime}
              onIonChange={(e) => {
                setData(Object.assign({}, data, { endTime: e.detail.value }));
              }}
            ></IonDatetime>
          </IonItem>
          <IonItem lines="none">
            <IonTextarea
              placeholder="その他・コメント"
              value={data.comment}
              onIonChange={(e) => {
                setData(Object.assign({}, data, { comment: e.detail.value }));
              }}
            ></IonTextarea>
          </IonItem>
          <IonButton color="dark" expand="full" type="submit">
            変更を保存する
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
