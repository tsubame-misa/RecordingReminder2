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
  IonChip,
  IonLabel,
} from "@ionic/react";
import { ellipsisHorizontal, trash } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { convertDate, CmpTime, convertIcon } from "./Future";
import { request_user_tv_list, request_delete } from "../auth_fetch/index";
import { useAuth0 } from "@auth0/auth0-react";
import { unchangedTextChangeRange } from "typescript";
import AX from "./img/AX.png";
import CX from "./img/CX.png";
import E from "./img/E.png";
import MX from "./img/MX.png";
import NHK from "./img/NHK.png";
import NX from "./img/NX.png";
import TBS from "./img/TBS.jpg";
import TX from "./img/TX.png";
import styles from "./styles.css";
const Past = () => {
  const [data, setData] = useState([]);
  let history = useHistory();
  const [showLoading, setShowLoading] = useState(false);
  const { getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();

  useIonViewWillEnter(() => {
    request_user_tv_list(getAccessTokenWithPopup).then((data) => {
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

  const delItem = (id) => {
    console.log("del", id);
    request_delete(
      `${process.env.REACT_APP_API_ENDPOINT}/delete_user_program_list/${id}`,
      getAccessTokenWithPopup
    ).then((data) => {
      setData(data);
    });
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
          <IonTitle>録画済み</IonTitle>
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
                <IonItem
                  _ngcontent-yfv-c79=""
                  onClick={() => {
                    history.push(`/detail/${d.id}/from_future`);
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
                    &emsp;{convertDate(d.date)} &emsp; {d.name}
                  </IonLabel>
                </IonItem>
                <IonItemOptions>
                  <IonItemOption
                    color="danger"
                    expandable
                    onClick={() => {
                      delItem(d.id);
                    }}
                  >
                    delete
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
