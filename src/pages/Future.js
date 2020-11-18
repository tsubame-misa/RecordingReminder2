import React, { useState } from "react";
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

export const convertDate = (input) => {
  if (input === null) {
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

const delItem = (ID) => {
  console.log("del", ID);
  /* for (let i = 0; i < data.length; i++) {
    if (data[i].id === ID) {
      setData((prevState) => {
        prevState.splice(i, 1);
        console.log(prevState);
        localStorage.setItem("data", JSON.stringify(prevState));
        return prevState;
      });
      break;
    }
  }*/
};

export async function fetchImages() {
  const response = await fetch(`http://localhost:8080/get_user_list`);
  const data = await response.json();
  return data;
}

const Loading = () => {
  return <p>Loading...</p>;
};

const Future = () => {
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [ID, setID] = useState();

  useIonViewWillEnter(() => {
    window
      .fetch(`http://localhost:8080/get_user_list`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  console.log(data);

  if (data === []) {
    return <Loading />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Future</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {data
          .filter((d) => {
            return CmpTime(d.date) > 0;
          })
          .map((d, id) => {
            return (
              <div>
                <IonItem key={id}>
                  {d.channel} &emsp;
                  {convertDate(d.date)} &emsp;
                  {d?.name}
                  <IonButton
                    slot="end"
                    fill="none"
                    color="dark"
                    href={`/host/detail/${id}`}
                  >
                    <IonIcon icon={ellipsisHorizontal}></IonIcon>
                  </IonButton>
                  <IonButton
                    slot="end"
                    fill="none"
                    color="dark"
                    onClick={() => {
                      setID(d.id);
                      console.log(d.id);
                      delItem(d.id);
                    }}
                  >
                    <IonIcon icon={trash}></IonIcon>
                  </IonButton>
                </IonItem>
              </div>
            );
          })}

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="my-custom-class"
          header={data[ID]}
          subHeader={"Subtitle"}
          message={"This is an alert message."}
          buttons={["OK"]}
        />

        <IonItem>{data[0]?.channel}</IonItem>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton href="/add_program" color="dark">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Future;
