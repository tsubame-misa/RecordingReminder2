import React, { useEffect, useState } from "react";
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
  const [ID, setID] = useState(null);
  const [idx, setIdx] = useState(-1);
  const { getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();
  const date_data = [];

  useIonViewWillEnter(() => {
    request(
      `${process.env.REACT_APP_API_ENDPOINT}/get_all_list`,
      getAccessTokenSilently
    ).then((data) => {
      setData(data);
    });
  }, []);

  if (data !== []) {
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
    if (data != undefined) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == ID) {
          setIdx(i);
        }
      }
    }
    console.log(idx);
  };

  const addMyList = (idx) => {
    console.log(data[idx].name);
    request_put(
      `${process.env.REACT_APP_API_ENDPOINT}/put_my_list/${data[idx].id}`,
      getAccessTokenSilently,
      data
    );
  };

  /*if (data === [] || data === undefined) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>録画済み</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen></IonContent>
      </IonPage>
    );
  }*/

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
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
                    setID(d.id);
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
              text: "登録",
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                addMyList(idx);
              },
            },
            {
              text: "戻る",
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Future;
