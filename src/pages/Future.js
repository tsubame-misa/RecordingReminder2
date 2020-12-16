import React, { useState, useEffect } from "react";
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
  useIonViewWillEnter,
  IonCheckbox,
  IonList,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonLoading,
  IonItemGroup,
  IonLabel,
  IonItemDivider,
  IonChip,
} from "@ionic/react";
import { add, ellipsisHorizontal, trash } from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import {
  request_user_tv_list,
  request,
  request_delete,
} from "../auth_fetch/index";
import { convertCompilerOptionsFromJson } from "typescript";
import AX from "./img/AX.png";
import CX from "./img/CX.png";
import E from "./img/E.png";
import MX from "./img/MX.png";
import NHK from "./img/NHK.png";
import NX from "./img/NX.png";
import TBS from "./img/TBS.jpg";
import TX from "./img/TX.png";
import styles from "./styles.css";
/*
export const convertDate = (input) => {
  if (input === null || input == undefined) {
    return "";
  }

  const dateList = input.split(/[-T:]/);

  const date = new Date(
    dateList[0],
    dateList[1] - 1,
    dateList[2],
    dateList[3],
    dateList[4],
    0,
    0
  );

  const createdDay =
    dateList[0] +
    "/" +
    dateList[1] +
    "/" +
    " " +
    dateList[3] +
    ":" +
    dateList[4];
  //console.log(createdDay);

  return createdDay;
};
*/

const channel_icons = [
  "NHK.png",
  "E.png",
  "NX.png",
  "AX.png",
  "TBS.jpg",
  "TX.png",
  "CX.png",
  "MX.png",
];

export const convertIcon = (input) => {
  if (input == "NHK総合") {
    return NHK;
  }
  if (input == "Eテレ") {
    return E;
  }
  if (input == "日テレ") {
    return NX;
  }
  if (input == "テレビ朝日") {
    return AX;
  }
  if (input == "TBS") {
    return TBS;
  }
  if (input == "テレビ東京") {
    return TX;
  }
  if (input == "フジテレビ") {
    return CX;
  }
  if (input == "東京MX") {
    return MX;
  }
};

export const convertDate = (input) => {
  if (input === null) {
    return "";
  }

  const d = new Date(`${input} UTC`);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const date = `${d.getDate()}`.padStart(2, "0");
  const hour = `${d.getHours()}`.padStart(2, "0");
  const minute = `${d.getMinutes()}`.padStart(2, "0");
  const createdDay =
    year + "/" + month + "/" + date + "/" + hour + ":" + minute;
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

const Future = ({ history }) => {
  const [data, setData] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    getAccessTokenWithPopup,
  } = useAuth0();

  useIonViewWillEnter(() => {
    request_user_tv_list(getAccessTokenSilently).then((data) => {
      setData(data);
    });
  }, []);

  if (data != undefined) {
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
            <IonTitle>録画リスト</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton
              color="dark"
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
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>録画リスト</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {data
          .filter((d) => {
            return CmpTime(d.date) > 0;
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
                  {/*<IonChip>{d.channel}</IonChip>*/}
                  <img
                    className="icon_image"
                    src={convertIcon(d.channel)}
                  ></img>
                  <IonLabel>
                    &emsp; {convertDate(d.date)} &emsp; {d.name}
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

        {/*<IonList>
          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>label</IonLabel>
            </IonItemDivider>
            <IonItemSliding>
              <IonItem
                _ngcontent-yfv-c79=""
                onClick={() => {
                  history.push(`/detail/${data[0].id}/from_future`);
                }}
                detail="false"
                target="_blank"
                class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
              >
                <IonChip>huji</IonChip>
                <IonLabel>mezamashi</IonLabel>
              </IonItem>
              <IonItemOptions>
                <IonItemOption>delete</IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          </IonItemGroup>
              </IonList>*/}

        <IonLoading
          cssClass="my-custom-class"
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={"Please wait..."}
          duration={1000}
        />

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            color="dark"
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
