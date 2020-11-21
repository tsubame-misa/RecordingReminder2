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
import { request_user_tv_list, request_delete } from "../auth_fetch/index";
import { useAuth0 } from "@auth0/auth0-react";

const Past = () => {
  const [data, setData] = useState([]);
  let history = useHistory();
  const token = useGetToken();
  const [showLoading, setShowLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  useIonViewWillEnter(() => {
    request_user_tv_list(getAccessTokenSilently).then((data) => {
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
    request_delete(
      `${process.env.REACT_APP_API_ENDPOINT}/delete_user_program_list/${id}`,
      getAccessTokenSilently
    ).then((data) => {
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
