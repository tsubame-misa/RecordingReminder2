import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  useIonViewWillEnter,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLoading,
  IonLabel,
  IonItemDivider,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { convertDate, CmpTime, convertIcon } from "./Future";
import { request_user_tv_list, request_delete } from "../auth_fetch/index";
import { useAuth0 } from "@auth0/auth0-react";

const Past = () => {
  const [data, setData] = useState([]);
  let history = useHistory();
  const [showLoading, setShowLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const date_data = [];

  useIonViewWillEnter(() => {
    request_user_tv_list(getAccessTokenSilently).then((data) => {
      setData(data);
    });
  }, []);

  if (data !== [] && data !== undefined) {
    data.sort((a, b) => {
      const a_date = convertDate(a.date);
      const b_date = convertDate(b.date);
      if (a_date > b_date) {
        return 1;
      } else {
        return -1;
      }
    });
    for (let i = 0; i < data.length; i++) {
      const d = convertDate(data[i].date).slice(0, 10);
      if (!date_data.includes(d)) {
        date_data.push([d, 0]);
      }
    }
  }

  const check = (date) => {
    for (let i = 0; i < date_data.length; i++) {
      if (date === date_data[i][0] && date_data[i][1] === 0) {
        date_data[i][1] = 1;
        return 1;
      }
      if (date <= date_data[i][0]) {
        return 0;
      }
    }
    return 0;
  };

  const delItem = (id) => {
    console.log("del", id);
    request_delete(
      `https://blooming-coast-85852.herokuapp.com/api/delete_user_program_list/${id}`,
      //`${process.env.REACT_APP_API_ENDPOINT}/delete_user_program_list/${id}`,
      getAccessTokenSilently
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
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {data
          .filter((d) => {
            return CmpTime(d.date) < 0;
          })
          .map((d, id) => {
            const date = convertDate(d.date);
            return (
              <div key={id}>
                {check(date.slice(0, 10)) === 1 ? (
                  <IonItemDivider>
                    <IonLabel>{date.slice(0, 10)}</IonLabel>
                  </IonItemDivider>
                ) : (
                  []
                )}
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
                      alt=""
                    ></img>
                    <IonLabel>
                      &emsp;{date.slice(11)} &emsp; {d.name}
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
              </div>
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
