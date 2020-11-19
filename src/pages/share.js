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
} from "@ionic/react";
import { add, ellipsisHorizontal, trash } from "ionicons/icons";
import notifications from "../notification/index";
import { useHistory } from "react-router-dom";
import { convertToObject } from "typescript";

export const convertDate = (input) => {
  if (input === null || input === undefined) {
    return "";
  }
  const dateList = input.split(/[-T:]/);
  const createdDay =
    dateList[0] +
    "/" +
    dateList[1] +
    "/" +
    dateList[2] +
    " " +
    dateList[3] +
    ":" +
    dateList[4];
  //console.log(createdDay);
  return createdDay;
};

export const CmpTime = (item) => {
  const current = new Date();
  const date0 = convertDate(item);
  const date = Date.parse(date0);
  if (date < current) {
    return -1;
  } else {
    return 1;
  }
};

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

const Future = ({ history }) => {
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [ID, setID] = useState(null);
  const [idx, setIdx] = useState(-1);

  // let history = useHistory();

  useIonViewWillEnter(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/get_user_list`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  data.sort((a, b) => {
    if (a.date > b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  if (data === []) {
    return <Loading />;
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Share</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {data
          .filter((d) => {
            return CmpTime(d.date) > 0;
          })
          .map((d, id) => {
            return (
              <IonItem key={id}>
                {d.channel} &emsp;
                {convertDate(d.date)} &emsp;
                {d.name}
                <IonButton
                  slot="end"
                  fill="none"
                  color="dark"
                  //href={`/detail/${d.id}/from_future`}
                  onClick={() => {
                    setID(d.id);
                    findIndx(d.id);
                    setShowAlert(true);

                    // history.push(`/detail/${d.id}/from_future`);
                  }}
                >
                  <IonIcon icon={ellipsisHorizontal}></IonIcon>
                </IonButton>
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
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Future;
