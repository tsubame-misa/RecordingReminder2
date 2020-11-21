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
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLoading,
} from "@ionic/react";
import { ellipsisHorizontal, trash } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useGetToken, convertDate, CmpTime } from "./Future";

const Past = () => {
  const [data, setData] = useState([]);
  let history = useHistory();
  const token = useGetToken();
  const [showLoading, setShowLoading] = useState(false);

  useIonViewWillEnter(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/get_user_list`, {
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  };

  if (data === []) {
    setShowLoading(true);
    return <div></div>;
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
              /*<IonItemSliding key={id}>
                <IonItem>
                  <IonButton
                    fill="clear"
                    onClick={() => {
                      history.push(`/detail/${d.id}/from_future`);
                    }}
                  >
                    <IonItem>
                      {d.channel} &emsp;
                      {convertDate(d.date)} &emsp;
                    </IonItem>
                    <IonItem> {d.name}</IonItem>
                  </IonButton>

                  <IonItemOptions side="end">
                    <IonItemOption
                      color="danger"
                      expandable
                      onClick={() => {
                        delItem(d.id);
                      }}
                    >
                      Delete
                    </IonItemOption>
                  </IonItemOptions>
                </IonItem>
                    </IonItemSliding>*/
              <IonItemSliding key={id}>
                <IonButton
                  fill="clear"
                  onClick={() => {
                    history.push(`/detail/${d.id}/from_future`);
                  }}
                >
                  <IonItem>
                    {" "}
                    {d.channel} &emsp;
                    {convertDate(d.date)} &emsp;
                    {d.name}
                  </IonItem>
                </IonButton>

                <IonItemOptions side="start">
                  <IonItemOption color="primary" expandable>
                    Edit
                  </IonItemOption>
                </IonItemOptions>
                <IonItemOptions side="end">
                  <IonItemOption
                    color="danger"
                    expandable
                    onClick={() => {
                      delItem(d.id);
                    }}
                  >
                    Delete
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            );
          })}
        <IonLoading
          cssClass="my-custom-class"
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={"Please wait..."}
          duration={1500}
        />
      </IonContent>
    </IonPage>
  );
};

export default Past;
