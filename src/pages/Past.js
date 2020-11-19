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

const Loading = () => {
  return <p>Loading...</p>;
};

const Past = () => {
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [ID, setID] = useState();

  useEffect(() => {
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
          <IonButton
            color="tertiary"
            onClick={() => notifications.schedule(30)}
          >
            Schedule Notification
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {data
          .filter((d) => {
            return CmpTime(d.date) < 0;
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
                    href={`/detail/${d.id}/from_past`}
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
      </IonContent>
    </IonPage>
  );
};

export default Past;
