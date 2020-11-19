import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonItem,
  IonButton,
  useIonViewWillEnter,
} from "@ionic/react";
import { ellipsisHorizontal, trash } from "ionicons/icons";
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

const Past = () => {
  const [data, setData] = useState([]);
  let history = useHistory();

  useIonViewWillEnter(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/get_user_list`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  //console.log(data);

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
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/delete_user_program_list/${id}`,
        {
          method: "DELETE",
        }
      )
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
          <IonTitle>Past</IonTitle>
          {/*<IonButton
            color="tertiary"
            onClick={() => notifications.schedule(30)}
          >
            Schedule Notification
          </IonButton>*/}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {data
          .filter((d) => {
            return CmpTime(d.date) < 0;
          })
          .map((d, id) => {
            return (
              <IonItem key={id}>
                {d.channel} &emsp;
                {convertDate(d.date)} &emsp;
                {d?.name}
                <IonButton
                  slot="end"
                  fill="none"
                  color="dark"
                  onClick={() => {
                    history.push(`/detail/${d.id}/from_past`);
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
            );
          })}
      </IonContent>
    </IonPage>
  );
};

export default Past;
