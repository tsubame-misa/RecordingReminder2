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
import { useGetToken, convertDate, CmpTime } from "../pages/Future";

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
  const token = useGetToken();

  // let history = useHistory();

  useIonViewWillEnter(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/get_all_list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
                {/*<IonButton
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
                >*/}
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
                {/*}  </IonButton>*/}
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
