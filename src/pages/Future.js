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

const Loading = () => {
  return <p>Loading...</p>;
};

const Future = () => {
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [ID, setID] = useState();
  let history = useHistory();

  useEffect(() => {
    window
      .fetch(`http://localhost:8080/get_user_list`)
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

  const delItem = (id) => {
    console.log("del", id);
    window
      .fetch(`http://localhost:8080/delete_user_program_list/${id}`, {
        method: "DELETE",
      })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  };

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
            onClick={() => notifications.schedule(10)}
          >
            Schedule Notification
          </IonButton>
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
                  {d.name}
                  <IonButton
                    slot="end"
                    fill="none"
                    color="dark"
                    //href={`/detail/${d.id}/from_future`}
                    onClick={() => {
                      history.push(`/detail/${d.id}/from_future`);
                    }}
                  >
                    <IonIcon icon={ellipsisHorizontal}></IonIcon>
                  </IonButton>
                  <IonButton
                    slot="end"
                    fill="none"
                    color="dark"
                    onClick={() => {
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

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            color="dark"
            //href="/add_program"
            onClick={() => {
              history.push("/add_program");
            }}
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Future;
