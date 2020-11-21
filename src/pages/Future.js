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

export const convertDate = (input) => {
  if (input === null || input == undefined) {
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

export const useGetToken = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: "https://rere",
          scope: "read:posts",
        });
        setData(await token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAccessTokenSilently]);
  return data;
};

const Future = ({ history }) => {
  const token = useGetToken();
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
    return <div>loading</div>;
    //setShowLoading(true);
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
                  <IonChip>{d.channel}</IonChip>
                  <IonLabel>
                    {convertDate(d.date)} &emsp; {d.name}
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
