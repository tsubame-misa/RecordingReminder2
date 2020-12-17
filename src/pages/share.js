import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonButton,
  IonAlert,
  useIonViewWillEnter,
  IonChip,
  IonLabel,
} from "@ionic/react";
import { add, ellipsisHorizontal, trash } from "ionicons/icons";
import notifications from "../notification/index";
import { useHistory } from "react-router-dom";
import { convertToObject } from "typescript";
import { convertDate, CmpTime, convertIcon } from "../pages/Future";
import { useAuth0 } from "@auth0/auth0-react";
import { request, request_put } from "../auth_fetch/index";
import AX from "./img/AX.png";
import CX from "./img/CX.png";
import E from "./img/E.png";
import MX from "./img/MX.png";
import NHK from "./img/NHK.png";
import NX from "./img/NX.png";
import TBS from "./img/TBS.jpg";
import TX from "./img/TX.png";
import styles from "./styles.css";

const splitArtist = (item) => {
  if (item === undefined) {
    return;
  }
  const dateList = item.split(/["}{,]/);
  console.log(dateList);
  return dateList.splice(1, dateList.length - 2);
};

const Loading = () => {
  return <p>Loading...</p>;
};

const Future = () => {
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [ID, setID] = useState(null);
  const [idx, setIdx] = useState(-1);
  const { getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();

  useIonViewWillEnter(() => {
    request(
      `${process.env.REACT_APP_API_ENDPOINT}/get_all_list`,
      getAccessTokenSilently
    ).then((data) => {
      setData(data);
    });
  }, []);
  //console.log(data);

  if (data !== undefined) {
    data.sort((a, b) => {
      if (a.date > b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  }

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

  if (data === [] || data === undefined) {
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
  }

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
            return (
              /*<IonItem key={id}>
                <IonItem
                  onClick={() => {
                    setID(d.id);
                    findIndx(d.id);
                    setShowAlert(true);
                  }}
                >
                  {d.channel} &emsp;
                  {convertDate(d.date)} &emsp;
                  {d.name}
                </IonItem>
                </IonItem>*/

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
                <img className="icon_image" src={convertIcon(d.channel)}></img>
                <IonLabel>
                  &emsp; {convertDate(d.date)} &emsp; {d.name}
                </IonLabel>
              </IonItem>
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
